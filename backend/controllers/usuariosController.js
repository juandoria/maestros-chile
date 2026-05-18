const { db } = require('../config/firebase');

const COLLECTION = 'usuarios';

// GET /api/usuarios/perfil  (requiere token)
async function getPerfil(req, res) {
  try {
    const doc = await db.collection(COLLECTION).doc(req.user.uid).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
}

// POST /api/usuarios/perfil  (requiere token — se llama al registrarse)
async function createPerfil(req, res) {
  try {
    const { nombre, telefono, comuna } = req.body;

    const perfil = {
      uid: req.user.uid,
      email: req.user.email,
      nombre,
      telefono,
      comuna,
      creadoEn: new Date().toISOString(),
    };

    await db.collection(COLLECTION).doc(req.user.uid).set(perfil);
    res.status(201).json(perfil);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el perfil' });
  }
}

module.exports = { getPerfil, createPerfil };
