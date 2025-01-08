/**
 * Rotas de Parceiros
 * 
 * Implementar as seguintes rotas:
 * 1. POST /partners
 *    - Criar novo parceiro
 * 
 * 2. GET /partners/:id
 *    - Buscar parceiro por ID
 * 
 * 3. GET /partners/search
 *    - Buscar parceiro mais próximo
 *    - Receber query params: lat e long
 */

import { Router } from 'express';
import PartnerController from '../controllers/partner.controller';
import { validateCreatePartner } from '../middlewares/validation.middleware';

const router = Router();

// Create a new partner
router.post('/', validateCreatePartner, PartnerController.createPartner);

// Get all partners
router.get('/', PartnerController.getAllPartners);

// Find nearest partner
router.get('/search', PartnerController.findNearestPartner);

// Get partner by ID
router.get('/:id', PartnerController.getPartnerById);

export default router;