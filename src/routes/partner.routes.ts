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

const router = require('express').Router();
const PartnerController = require('../controllers/PartnerController');

router.post('/partners', PartnerController.createPartner);
router.get('/partners/:id', PartnerController.getPartnerById);
router.get('/partners/search', PartnerController.searchNearestPartner);

module.exports = router;