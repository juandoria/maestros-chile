const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  getMaestros,
  getMaestroById,
  createMaestro,
  updateMaestro,
} = require('../controllers/maestrosController');

router.get('/', getMaestros);
router.get('/:id', getMaestroById);
router.post('/', verifyToken, createMaestro);
router.put('/:id', verifyToken, updateMaestro);

module.exports = router;
