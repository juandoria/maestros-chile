const express = require('express');
const router = express.Router({ mergeParams: true });
const verifyToken = require('../middleware/verifyToken');
const { getReseñas, createReseña } = require('../controllers/reseñasController');

router.get('/',  getReseñas);
router.post('/', verifyToken, createReseña);

module.exports = router;
