/**
 * Arquivo principal da aplicação
 * 
 * Implementar:
 * 1. Configurar Express
 * 2. Configurar CORS
 * 3. Configurar conexão com banco de dados
 * 4. Importar e usar as rotas
 * 5. Iniciar o servidor na porta definida
 */

import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { connectToDatabase } from './config/database';
import { errorHandler } from './middlewares/error.middleware';
import partnerRoutes from './routes/partner.routes';

const app = express();
const DEFAULT_PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/partners', partnerRoutes);

// Error handling
app.use(errorHandler);

const findAvailablePort = async (startPort: number): Promise<number> => {
  return new Promise((resolve) => {
    const server = app.listen(startPort)
      .on('listening', () => {
        server.close(() => resolve(startPort));
      })
      .on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          resolve(findAvailablePort(startPort + 1));
        }
      });
  });
};

const startServer = async () => {
  try {
    // Connect to database first
    await connectToDatabase();
    console.log('Connected to MongoDB successfully');

    // Find available port
    const port = await findAvailablePort(DEFAULT_PORT);
    
    // Start server
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
};

// Start the application
startServer();