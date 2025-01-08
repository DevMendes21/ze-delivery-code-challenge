export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class GeoValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeoValidationError';
  }
}

export class PartnerNotFoundError extends Error {
  constructor(id: string) {
    super(`Partner not found with id: ${id}`);
    this.name = 'PartnerNotFoundError';
  }
}

export class InvalidCoordinatesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCoordinatesError';
  }
}
