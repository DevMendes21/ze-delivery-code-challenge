/**
 * Utilitários para operações geoespaciais
 * 
 * Implementar:
 * 1. Conversão de coordenadas
 * 2. Validação de GeoJSON
 * 3. Cálculos de distância
 * 4. Verificação de pontos dentro de polígonos
 */

import * as turf from '@turf/turf';
import { MultiPolygon, Point } from 'geojson';
import { ValidationError } from './errors';

export class GeoUtils {
  static isValidGeoJSON(geojson: any): boolean {
    try {
      if (!geojson || !geojson.type || !geojson.coordinates) {
        return false;
      }

      if (geojson.type === 'Point') {
        return Array.isArray(geojson.coordinates) && 
               geojson.coordinates.length === 2 &&
               typeof geojson.coordinates[0] === 'number' && 
               typeof geojson.coordinates[1] === 'number';
      }

      if (geojson.type === 'MultiPolygon') {
        return Array.isArray(geojson.coordinates) && 
               geojson.coordinates.every((polygon: any[]) => 
                 Array.isArray(polygon) && 
                 polygon.every((ring: any[]) => 
                   Array.isArray(ring) && 
                   ring.every((coord: any[]) => 
                     Array.isArray(coord) && 
                     coord.length === 2 &&
                     typeof coord[0] === 'number' && 
                     typeof coord[1] === 'number'
                   )
                 )
               );
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  static isValidPoint(point: any): point is Point {
    console.log('Validating point:', JSON.stringify(point));
    
    // Basic structure validation
    if (!point || typeof point !== 'object') {
      console.log('Point is not an object');
      return false;
    }
    
    // Type validation
    if (!point.type || point.type !== 'Point') {
      console.log('Type is not Point:', point.type);
      return false;
    }
    
    // Coordinates validation
    if (!point.coordinates || !Array.isArray(point.coordinates)) {
      console.log('Coordinates is not an array');
      return false;
    }
    
    if (point.coordinates.length !== 2) {
      console.log('Coordinates length is not 2');
      return false;
    }
    
    const [longitude, latitude] = point.coordinates;
    
    // Type check for coordinates
    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
      console.log('Coordinates are not numbers:', { longitude, latitude });
      return false;
    }
    
    // Range validation
    if (latitude < -90 || latitude > 90) {
      console.log('Invalid latitude range:', latitude);
      return false;
    }
    
    if (longitude < -180 || longitude > 180) {
      console.log('Invalid longitude range:', longitude);
      return false;
    }
    
    console.log('Point validation successful:', { longitude, latitude });
    return true;
  }

  static isValidMultiPolygon(multiPolygon: any): multiPolygon is MultiPolygon {
    if (!multiPolygon || typeof multiPolygon !== 'object') return false;
    if (multiPolygon.type !== 'MultiPolygon') return false;
    if (!Array.isArray(multiPolygon.coordinates)) return false;

    // Validate each polygon in the MultiPolygon
    return multiPolygon.coordinates.every((polygon: any[]) => {
      if (!Array.isArray(polygon)) return false;
      
      // Each polygon must have at least one linear ring (outer boundary)
      return polygon.every((linearRing: any[]) => {
        if (!Array.isArray(linearRing)) return false;
        if (linearRing.length < 4) return false;

        // First and last points must be the same
        if (JSON.stringify(linearRing[0]) !== JSON.stringify(linearRing[linearRing.length - 1])) {
          return false;
        }

        // Each point in the linear ring must be valid coordinates
        return linearRing.every((point: any[]) => {
          if (!Array.isArray(point) || point.length !== 2) return false;
          const [longitude, latitude] = point;
          return this.isValidCoordinates(longitude, latitude);
        });
      });
    });
  }

  static isValidCoordinates(longitude: number, latitude: number): boolean {
    console.log(`Validating coordinates: longitude=${longitude}, latitude=${latitude}`);
    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
      console.log('Coordinates are not numbers');
      return false;
    }

    if (isNaN(longitude) || isNaN(latitude)) {
      console.log('Coordinates are NaN');
      return false;
    }

    if (latitude < -90 || latitude > 90) {
      console.log('Invalid latitude range');
      return false;
    }

    if (longitude < -180 || longitude > 180) {
      console.log('Invalid longitude range');
      return false;
    }

    return true;
  }

  static validateCoordinates(longitude: number, latitude: number): void {
    if (!this.isValidCoordinates(longitude, latitude)) {
      throw new ValidationError(
        'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.'
      );
    }
  }

  static toGeoPoint(coordinates: number[]): Point {
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      throw new Error('Invalid coordinates array. Must be [longitude, latitude]');
    }

    return {
      type: 'Point',
      coordinates: coordinates
    };
  }

  static calculateDistance(point1: Point, point2: Point): number {
    const from = turf.point(point1.coordinates);
    const to = turf.point(point2.coordinates);
    return turf.distance(from, to, { units: 'kilometers' });
  }

  static isPointInPolygon(point: Point, multiPolygon: MultiPolygon): boolean {
    const pt = turf.point(point.coordinates);
    
    // Convert MultiPolygon coordinates to Features
    const polygons = multiPolygon.coordinates.map(coords => {
      return turf.polygon(coords);
    });

    // Check if point is in any of the polygons
    return polygons.some(polygon => turf.booleanPointInPolygon(pt, polygon));
  }
}