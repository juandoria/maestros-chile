const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getPerfil, createPerfil } = require('../controllers/usuariosController');

router.get('/perfil', verifyToken, getPerfil);
router.post('/perfil', verifyToken, createPerfil);

module.exports = router;
