const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  getMaestros,
  getMiPerfil,
  getMaestroById,
  createMaestro,
  updateMaestro,
} = require('../controllers/maestrosController');

router.get('/', getMaestros);
router.get('/mi-perfil', verifyToken, getMiPerfil); // debe ir antes de /:id
router.get('/:id', getMaestroById);
router.post('/', verifyToken, createMaestro);
router.put('/:id', verifyToken, updateMaestro);

module.exports = router;
