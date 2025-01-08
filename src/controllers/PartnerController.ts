/**
 * Controller de Parceiros
 * 
 * Implementar endpoints:
 * 1. POST /partners - Criar parceiro
 * 2. GET /partners/:id - Buscar parceiro por ID
 * 3. GET /partners/search - Busca geoespacial:
 *    - Encontrar parceiro mais próximo que cubra a localização
 *    - Usar queries geoespaciais do MongoDB
 */

import { Request, Response } from 'express';
import PartnerService from '../services/PartnerService';
import { PartnerNotFoundError, ValidationError } from '../utils/errors';

class PartnerController {
  static async createPartner(req: Request, res: Response): Promise<void> {
    try {
      const partner = await PartnerService.createPartner(req.body);
      res.status(201).json(partner);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        console.error('Error creating partner:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async getPartnerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const partner = await PartnerService.getPartnerById(id);
      res.json(partner);
    } catch (error) {
      if (error instanceof PartnerNotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        console.error('Error getting partner:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async findAll(_req: Request, res: Response): Promise<void> {
    try {
      const partners = await PartnerService.findAll();
      res.json(partners);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async findNearestPartner(req: Request, res: Response): Promise<void> {
    try {
      const { lat, long } = req.query;
      
      if (!lat || !long) {
        res.status(400).json({ error: 'Missing latitude or longitude parameters' });
        return;
      }

      const latitude = Number(lat);
      const longitude = Number(long);

      if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({ error: 'Invalid coordinates format' });
        return;
      }

      const partner = await PartnerService.findNearestPartner(latitude, longitude);
      
      if (!partner) {
        res.status(404).json({ error: 'No partner found in the coverage area' });
        return;
      }

      res.json(partner);
    } catch (error) {
      console.error('Error finding nearest partner:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default PartnerController;