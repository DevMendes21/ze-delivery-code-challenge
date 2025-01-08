import { Request, Response } from 'express';
import PartnerService from '../services/partner.service';
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

  static async getAllPartners(_req: Request, res: Response): Promise<void> {
    try {
      const partners = await PartnerService.findAll();
      res.json(partners);
    } catch (error) {
      console.error('Error getting partners:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getPartnerById(req: Request, res: Response): Promise<void> {
    try {
      const partner = await PartnerService.getPartnerById(req.params.id);
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

  static async findNearestPartner(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lng } = req.query;
      
      if (!lat || !lng) {
        res.status(400).json({ error: 'Latitude and longitude are required' });
        return;
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);

      if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({ error: 'Invalid latitude or longitude' });
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
