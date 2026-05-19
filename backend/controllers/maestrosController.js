const { db } = require('../config/firebase');

const COLLECTION = 'maestros';

// GET /api/maestros?oficio=electricista&comuna=Peñalolén
async function getMaestros(req, res) {
  try {
    const { oficio, comuna } = req.query;
    let query = db.collection(COLLECTION);

    // Soporta tanto 'oficios' (array nuevo) como 'oficio' (campo legado)
    if (oficio) query = query.where('oficios', 'array-contains', oficio);
    if (comuna) query = query.where('comuna', '==', comuna);

    const snapshot = await query.get();
    const maestros = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.json(maestros);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener maestros' });
  }
}

// GET /api/maestros/mi-perfil  (requiere token — devuelve el perfil del maestro autenticado)
async function getMiPerfil(req, res) {
  try {
    const snapshot = await db.collection(COLLECTION)
      .where('uid', '==', req.user.uid)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'No tienes perfil de maestro aún' });
    }

    const doc = snapshot.docs[0];
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tu perfil' });
  }
}

// GET /api/maestros/:id
async function getMaestroById(req, res) {
  try {
    const doc = await db.collection(COLLECTION).doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Maestro no encontrado' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el maestro' });
  }
}

// POST /api/maestros  (requiere token)
async function createMaestro(req, res) {
  try {
    const { nombre, oficios, oficio, comuna, descripcion, precioPorHora, especialidades, horario, fotoUrl, disponible } = req.body;

    const nuevoPerfil = {
      uid: req.user.uid,
      nombre:        nombre        || '',
      oficios:       oficios       || (oficio ? [oficio] : []),
      comuna:        comuna        || '',
      descripcion:   descripcion   || '',
      precioPorHora: precioPorHora || 0,
      especialidades: especialidades || [],
      horario:       horario       || null,
      fotoUrl:       fotoUrl       || '',
      disponible:    disponible    ?? true,
      calificacion:  0,
      totalReseñas:  0,
      creadoEn:      new Date().toISOString(),
    };

    const docRef = await db.collection(COLLECTION).add(nuevoPerfil);
    res.status(201).json({ id: docRef.id, ...nuevoPerfil });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el perfil' });
  }
}

// PUT /api/maestros/:id  (requiere token, solo el dueño)
async function updateMaestro(req, res) {
  try {
    const docRef = db.collection(COLLECTION).doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Maestro no encontrado' });
    }

    if (doc.data().uid !== req.user.uid) {
      return res.status(403).json({ error: 'No tienes permiso para editar este perfil' });
    }

    const { nombre, oficios, oficio, comuna, descripcion, precioPorHora, especialidades, horario, fotoUrl, disponible } = req.body;

    const cambios = {
      nombre,
      oficios: oficios || (oficio ? [oficio] : undefined),
      comuna,
      descripcion,
      precioPorHora,
      especialidades,
      horario,
      fotoUrl,
      disponible,
    };

    Object.keys(cambios).forEach((k) => cambios[k] === undefined && delete cambios[k]);

    await docRef.update(cambios);
    res.json({ mensaje: 'Perfil actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
}

module.exports = { getMaestros, getMiPerfil, getMaestroById, createMaestro, updateMaestro };
