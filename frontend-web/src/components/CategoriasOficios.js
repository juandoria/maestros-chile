import { useNavigate } from 'react-router-dom';

const CATEGORIAS = [
  { nombre: 'Electricista',           icono: '⚡', desc: 'Instalaciones y reparaciones eléctricas' },
  { nombre: 'Gasfíter',               icono: '🔧', desc: 'Cañerías, grifos y duchas' },
  { nombre: 'Carpintero',             icono: '🪚', desc: 'Muebles, puertas y ventanas' },
  { nombre: 'Pintor',                 icono: '🎨', desc: 'Pintura interior y exterior' },
  { nombre: 'Albañil',                icono: '🧱', desc: 'Construcción y reparación de muros' },
  { nombre: 'Cerrajero',              icono: '🔑', desc: 'Cerraduras, llaves y portones' },
  { nombre: 'Técnico en calefacción', icono: '🔥', desc: 'Calefones, estufas y radiadores' },
  { nombre: 'Jardinero',              icono: '🌿', desc: 'Poda, riego y mantención de jardines' },
];

function CategoriasOficios() {
  const navigate = useNavigate();

  return (
    <section style={s.seccion}>
      <div style={s.inner}>
        <h2 style={s.titulo}>Categorías de oficios</h2>
        <p style={s.subtitulo}>Toque el oficio que necesita</p>

        <div style={s.grilla}>
          {CATEGORIAS.map(({ nombre, icono, desc }) => (
            <button
              key={nombre}
              onClick={() => navigate(`/maestros?oficio=${encodeURIComponent(nombre)}`)}
              style={s.tarjeta}
            >
              <span style={s.icono}>{icono}</span>
              <strong style={s.nombre}>{nombre}</strong>
              <span style={s.desc}>{desc}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/maestros')}
          style={s.botonVerTodos}
        >
          Ver todos los oficios →
        </button>
      </div>
    </section>
  );
}

const s = {
  seccion: { backgroundColor: '#ffffff', padding: '64px 24px' },
  inner: { maxWidth: 1100, margin: '0 auto', textAlign: 'center' },
  titulo: { fontSize: 32, fontWeight: '800', color: '#0f2a22', margin: '0 0 10px' },
  subtitulo: { fontSize: 19, color: '#4b7062', marginBottom: 40 },
  grilla: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 20, marginBottom: 36,
  },
  tarjeta: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    padding: '28px 16px', backgroundColor: '#f0fdf8',
    border: '2px solid #b7e4ce', borderRadius: 16,
    cursor: 'pointer', transition: 'border-color 0.15s',
  },
  icono: { fontSize: 52 },
  nombre: { fontSize: 18, fontWeight: '800', color: '#0f2a22' },
  desc: { fontSize: 15, color: '#4b7062', lineHeight: 1.4, textAlign: 'center' },
  botonVerTodos: {
    padding: '14px 36px', backgroundColor: '#1D9E75', color: '#ffffff',
    border: 'none', borderRadius: 10, fontSize: 18, fontWeight: '700',
    cursor: 'pointer',
  },
};

export default CategoriasOficios;
