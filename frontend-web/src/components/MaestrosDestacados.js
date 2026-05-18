import { useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const ICONOS = {
  'Electricista': '⚡', 'Gasfíter': '🔧', 'Carpintero': '🪚',
  'Pintor': '🎨', 'Albañil': '🧱', 'Cerrajero': '🔑',
  'Técnico en calefacción': '🔥', 'Jardinero': '🌿',
};

function Estrellas({ valor }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar key={i} size={16} color={i <= Math.round(valor) ? '#EF9F27' : '#d1d5db'} />
      ))}
      <span style={{ marginLeft: 6, fontSize: 15, color: '#4b7062', fontWeight: '700' }}>
        {valor > 0 ? valor.toFixed(1) : 'Nuevo'}
      </span>
    </span>
  );
}

function MaestrosDestacados({ maestros }) {
  const navigate = useNavigate();

  if (!maestros || maestros.length === 0) return null;

  return (
    <section style={s.seccion}>
      <div style={s.inner}>

        <div style={s.badgeFila}>
          <span style={s.badge}>
            <FaStar size={16} color="#EF9F27" /> &nbsp;Maestros destacados
          </span>
        </div>

        <h2 style={s.titulo}>Los mejores maestros de Chile</h2>
        <p style={s.subtitulo}>Verificados, con experiencia y disponibles para ti</p>

        <div style={s.grilla}>
          {maestros.map((m) => (
            <div key={m.id} style={s.card}>
              <div style={s.cardHeader}>
                <div style={s.badgeDestacado}>
                  <FaStar size={12} color="#EF9F27" /> &nbsp;Destacado
                </div>
                <div style={s.avatarCirculo}>{m.nombre?.[0]}</div>
                <div>
                  <h3 style={s.nombre}>{m.nombre}</h3>
                  <p style={s.oficio}>
                    {ICONOS[m.oficio] || '🔧'} &nbsp;{m.oficio}
                  </p>
                  <p style={s.ubicacion}>
                    <FaMapMarkerAlt size={13} color="#1D9E75" /> &nbsp;{m.comuna}
                  </p>
                </div>
              </div>

              <div style={s.calificacion}>
                <Estrellas valor={m.calificacion || 0} />
                {m.totalReseñas > 0 && (
                  <span style={s.reseñas}>({m.totalReseñas} reseñas)</span>
                )}
              </div>

              {m.especialidades?.length > 0 && (
                <div style={s.chips}>
                  {m.especialidades.slice(0, 3).map((esp) => (
                    <span key={esp} style={s.chip}>{esp}</span>
                  ))}
                </div>
              )}

              <p style={s.precio}>${m.precioPorHora?.toLocaleString('es-CL')} / hora</p>

              <button
                onClick={() => navigate(`/maestros/${m.id}`)}
                style={s.botonContactar}
              >
                Contactar ahora
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const s = {
  seccion: { backgroundColor: '#fffdf5', padding: '64px 24px', borderTop: '3px solid #f5e0b0' },
  inner: { maxWidth: 1100, margin: '0 auto', textAlign: 'center' },

  badgeFila: { marginBottom: 18 },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    backgroundColor: '#FEF3DC', color: '#92600a',
    border: '2px solid #EF9F27', borderRadius: 24,
    padding: '8px 20px', fontSize: 16, fontWeight: '800',
  },
  titulo: { fontSize: 30, fontWeight: '800', color: '#0f2a22', margin: '0 0 10px' },
  subtitulo: { fontSize: 18, color: '#4b7062', marginBottom: 40 },

  grilla: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 24, textAlign: 'left',
  },
  card: {
    backgroundColor: '#ffffff', border: '2px solid #EF9F27',
    borderRadius: 18, padding: 24,
    boxShadow: '0 4px 16px rgba(239,159,39,0.15)',
    display: 'flex', flexDirection: 'column', gap: 14,
  },
  cardHeader: { display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' },
  badgeDestacado: {
    position: 'absolute', top: -8, right: -8,
    display: 'inline-flex', alignItems: 'center',
    backgroundColor: '#EF9F27', color: '#ffffff',
    borderRadius: 20, padding: '4px 10px',
    fontSize: 13, fontWeight: '800',
  },
  avatarCirculo: {
    width: 64, height: 64, borderRadius: '50%',
    backgroundColor: '#1D9E75', color: '#ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 28, fontWeight: '800', flexShrink: 0,
  },
  nombre: { fontSize: 20, fontWeight: '800', color: '#0f2a22', margin: '0 0 4px' },
  oficio: { fontSize: 16, color: '#0f2a22', margin: '0 0 3px', fontWeight: '600' },
  ubicacion: { display: 'flex', alignItems: 'center', fontSize: 15, color: '#4b7062', margin: 0 },
  calificacion: { display: 'flex', alignItems: 'center', gap: 8 },
  reseñas: { fontSize: 14, color: '#4b7062' },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: '#E1F5EE', color: '#085041',
    borderRadius: 20, padding: '4px 12px',
    fontSize: 13, fontWeight: '700',
  },
  precio: { fontSize: 20, fontWeight: '800', color: '#1D9E75', margin: 0 },
  botonContactar: {
    backgroundColor: '#1D9E75', color: '#ffffff',
    border: 'none', borderRadius: 10, padding: '14px 20px',
    fontSize: 17, fontWeight: '800', cursor: 'pointer',
    marginTop: 4,
  },
};

export default MaestrosDestacados;
