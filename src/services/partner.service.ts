/**
 * Serviço de Parceiros
 * 
 * Implementar:
 * 1. CRUD de parceiros
 * 2. Busca geoespacial:
 *    - Calcular distância entre pontos
 *    - Encontrar parceiro mais próximo
 */

import { Partner } from '../models/Partner';
import { ValidationError, PartnerNotFoundError } from '../utils/errors';

class PartnerService {
  static async createPartner(partnerData: any) {
    console.log('Creating partner with data:', JSON.stringify(partnerData, null, 2));

    // Validate required fields
    const requiredFields = ['id', 'tradingName', 'ownerName', 'document', 'coverageArea', 'address'];
    for (const field of requiredFields) {
      if (!partnerData[field]) {
        throw new ValidationError(`Missing required field: ${field}`);
      }
    }

    // Validate GeoJSON structure
    if (!partnerData.address?.type || partnerData.address.type !== 'Point' ||
        !Array.isArray(partnerData.address.coordinates) || 
        partnerData.address.coordinates.length !== 2) {
      throw new ValidationError('Address must be a valid GeoJSON Point with [longitude, latitude] coordinates');
    }

    if (!partnerData.coverageArea?.type || partnerData.coverageArea.type !== 'MultiPolygon' ||
        !Array.isArray(partnerData.coverageArea.coordinates)) {
      throw new ValidationError('Coverage area must be a valid GeoJSON MultiPolygon');
    }

    try {
      // Create a new partner instance
      const partner = new Partner({
        id: partnerData.id,
        tradingName: partnerData.tradingName,
        ownerName: partnerData.ownerName,
        document: partnerData.document,
        address: {
          type: 'Point',
          coordinates: [
            Number(partnerData.address.coordinates[0]),
            Number(partnerData.address.coordinates[1])
          ]
        },
        coverageArea: {
          type: 'MultiPolygon',
          coordinates: partnerData.coverageArea.coordinates
        }
      });

      // Save the partner
      return await partner.save();
    } catch (error: any) {
      console.error('Error creating partner:', error);
      if (error.code === 11000) {
        throw new ValidationError('Partner with this ID or document already exists');
      }
      throw error;
    }
  }

  static async findAll() {
    return await Partner.find();
  }

  static async getPartnerById(id: string) {
    const partner = await Partner.findOne({ id });
    if (!partner) {
      throw new PartnerNotFoundError(`Partner with id ${id} not found`);
    }
    return partner;
  }

  static async findNearestPartner(latitude: number, longitude: number) {
    const point = {
      type: 'Point',
      coordinates: [longitude, latitude] // MongoDB expects [longitude, latitude]
    };

    // Find the nearest partner whose coverage area contains the point
    const partner = await Partner.findOne({
      coverageArea: {
        $geoIntersects: {
          $geometry: point
        }
      }
    }).exec();

    return partner;
  }
}

export default PartnerService;
