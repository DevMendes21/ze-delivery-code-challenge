# Zé Delivery Partner Location Service

A RESTful API service that manages beverage delivery partners and their coverage areas using GeoJSON data.

## Features

- Create new delivery partners with coverage areas
- Find partners by ID
- Search for the nearest partner based on coordinates
- GeoJSON validation and processing
- MongoDB with geospatial indexes for efficient queries

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ze-code-challenge
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
MONGO_URL=mongodb://localhost:27017/ze-delivery
PORT=3000
MONGO_MIN_POOL_SIZE=5
MONGO_MAX_POOL_SIZE=10
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Create Partner
```http
POST /api/partners
Content-Type: application/json

{
  "id": "1",
  "tradingName": "Adega da Cerveja - Pinheiros",
  "ownerName": "Zé da Silva",
  "document": "1432132123891/0001",
  "coverageArea": {
    "type": "MultiPolygon",
    "coordinates": [
      [[[30, 20], [45, 40], [10, 40], [30, 20]]],
      [[[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]]
    ]
  },
  "address": {
    "type": "Point",
    "coordinates": [-46.57421, -21.785741]
  }
}
```

### Get Partner by ID
```http
GET /api/partners/:id
```

### Search Nearest Partner
```http
GET /api/partners/search?lat=-23.56278&long=-46.65795
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Architecture

The project follows a clean architecture pattern with the following structure:

- `src/models`: Database models and schemas
- `src/controllers`: Request handlers
- `src/services`: Business logic
- `src/routes`: API route definitions
- `src/middlewares`: Express middlewares
- `src/utils`: Helper functions
- `src/config`: Configuration files

## Performance Considerations

- Uses MongoDB's geospatial indexes for efficient location-based queries
- Implements connection pooling for better database performance
- Validates GeoJSON data before processing
- Uses TypeScript for better type safety and maintainability

## Error Handling

The API implements comprehensive error handling for:
- Validation errors
- Database errors
- GeoJSON format errors
- Duplicate entries
- Invalid coordinates

## Production Deployment

1. Build the TypeScript code:
```bash
npm run build
```

2. Set environment variables for production:
```bash
export MONGO_URL=your_mongodb_url
export PORT=3000
```

3. Start the server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
