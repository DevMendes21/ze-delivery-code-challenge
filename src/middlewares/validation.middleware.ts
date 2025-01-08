import { NextFunction, Request, Response } from 'express';
import { InvalidCoordinatesError, ValidationError } from '../utils/errors';

export const validateSearchParams = (req: Request & { validatedCoords?: { latitude: number; longitude: number } }, res: Response, next: NextFunction): void => {
  try {
    const { lat, long } = req.query;

    if (!lat || !long) {
      throw new InvalidCoordinatesError('Missing latitude or longitude');
    }

    const latitude = Number(lat);
    const longitude = Number(long);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new InvalidCoordinatesError('Invalid coordinates: must be numbers');
    }

    if (latitude < -90 || latitude > 90) {
      throw new InvalidCoordinatesError(`Invalid latitude: ${latitude}. Must be between -90 and 90`);
    }

    if (longitude < -180 || longitude > 180) {
      throw new InvalidCoordinatesError(`Invalid longitude: ${longitude}. Must be between -180 and 180`);
    }

    // Add validated coordinates to request
    req.validatedCoords = { latitude, longitude };
    next();
  } catch (error) {
    if (error instanceof InvalidCoordinatesError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const validateCreatePartner = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { tradingName, ownerName, document, coverageArea, address } = req.body;

    // Check required fields
    if (!tradingName || !ownerName || !document) {
      throw new ValidationError('Missing required fields: tradingName, ownerName, document');
    }

    // Validate address
    if (!address || !address.type || address.type !== 'Point') {
      throw new ValidationError('Invalid address format');
    }

    if (!Array.isArray(address.coordinates) || address.coordinates.length !== 2) {
      throw new ValidationError('Invalid address coordinates format');
    }

    // Validate coverage area
    if (!coverageArea || !coverageArea.type || coverageArea.type !== 'MultiPolygon') {
      throw new ValidationError('Invalid coverage area format');
    }

    if (!Array.isArray(coverageArea.coordinates)) {
      throw new ValidationError('Invalid coverage area coordinates format');
    }

    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
