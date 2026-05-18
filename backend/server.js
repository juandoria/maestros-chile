require('dotenv').config();
const express = require('express');
const cors = require('cors');

const maestrosRoutes = require('./routes/maestros');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/maestros', maestrosRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Ruta de salud — útil para verificar que el servidor está corriendo
app.get('/health', (req, res) => {
  res.json({ estado: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
