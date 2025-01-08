import { Express } from 'express-serve-static-core';

declare namespace Express {
  export interface Request {
    validatedCoords?: {
      latitude: number;
      longitude: number;
    };
  }
}
