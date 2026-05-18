require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { db } = require('../config/firebase');

const maestroDePrueba = {
  uid: 'seed-001',
  nombre: 'Carlos Muñoz',
  oficio: 'Electricista',
  comuna: 'Peñalolén',
  descripcion: 'Electricista con 15 años de experiencia en instalaciones residenciales y comerciales. Trabajo limpio, puntual y con garantía.',
  precioPorHora: 25000,
  especialidades: ['Instalaciones eléctricas', 'Tableros eléctricos', 'Iluminación LED'],
  calificacion: 4.8,
  totalReseñas: 32,
  disponible: true,
  destacado: true,
  creadoEn: new Date().toISOString(),
};

async function seed() {
  try {
    const docRef = await db.collection('maestros').add(maestroDePrueba);
    console.log(`✅ Maestro creado con ID: ${docRef.id}`);
    console.log(`   Nombre: ${maestroDePrueba.nombre}`);
    console.log(`   Oficio: ${maestroDePrueba.oficio}`);
    console.log(`   Destacado: ${maestroDePrueba.destacado}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear el maestro:', error.message);
    process.exit(1);
  }
}

seed();
