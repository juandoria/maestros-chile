const { db } = require('../config/firebase');

const RESEÑAS  = 'reseñas';
const MAESTROS = 'maestros';

// GET /api/maestros/:id/reseñas
async function getReseñas(req, res) {
  try {
    const snapshot = await db.collection(RESEÑAS)
      .where('maestroId', '==', req.params.id)
      .orderBy('creadoEn', 'desc')
      .get();

    const reseñas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(reseñas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reseñas' });
  }
}

// POST /api/maestros/:id/reseñas  (requiere token)
async function createReseña(req, res) {
  try {
    const { calificacion, comentario, clienteNombre, categorias } = req.body;
    const maestroId = req.params.id;

    if (!calificacion || calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ error: 'La calificación debe ser entre 1 y 5' });
    }

    // Verificar que el maestro existe
    const maestroDoc = await db.collection(MAESTROS).doc(maestroId).get();
    if (!maestroDoc.exists) {
      return res.status(404).json({ error: 'Maestro no encontrado' });
    }

    // Evitar que el maestro se califique a sí mismo
    if (maestroDoc.data().uid === req.user.uid) {
      return res.status(403).json({ error: 'No puedes calificarte a ti mismo' });
    }

    // Guardar la reseña
    const nuevaReseña = {
      maestroId,
      clienteUid:    req.user.uid,
      clienteNombre: clienteNombre || 'Cliente',
      calificacion:  Number(calificacion),
      categorias:    categorias || {},
      comentario:    comentario || '',
      creadoEn:      new Date().toISOString(),
    };

    await db.collection(RESEÑAS).add(nuevaReseña);

    // Recalcular promedio en el documento del maestro
    const todasReseñas = await db.collection(RESEÑAS)
      .where('maestroId', '==', maestroId)
      .get();

    const total = todasReseñas.size;
    const suma  = todasReseñas.docs.reduce((acc, d) => acc + d.data().calificacion, 0);
    const promedio = Math.round((suma / total) * 10) / 10;

    await db.collection(MAESTROS).doc(maestroId).update({
      calificacion: promedio,
      totalReseñas: total,
    });

    res.status(201).json({ mensaje: 'Reseña enviada correctamente', calificacion: promedio });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la reseña' });
  }
}

module.exports = { getReseñas, createReseña };
