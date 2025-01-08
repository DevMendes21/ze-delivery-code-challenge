/**
 * Configuração do Banco de Dados
 * 
 * Implementar:
 * 1. Configuração de conexão com MongoDB
 * 2. Variáveis de ambiente para dados sensíveis
 * 3. Índices geoespaciais necessários
 * 4. Configurações de pool de conexões
 */

import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/ze-delivery';

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Successfully connected to MongoDB.');

    // Event handlers
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};