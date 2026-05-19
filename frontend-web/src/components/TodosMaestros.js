import { useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { useResponsive } from '../hooks/useResponsive';

const ICONOS = {
  'Electricista': '⚡', 'Gasfíter': '🔧', 'Carpintero': '🪚',
  'Pintor': '🎨', 'Albañil': '🧱', 'Cerrajero': '🔑',
  'Técnico en calefacción': '🔥', 'Jardinero': '🌿',
};

function TodosMaestros({ maestros }) {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  if (!maestros || maestros.length === 0) return null;

  return (
    <section style={s.seccion}>
      <div style={s.inner}>
        <h2 style={s.titulo}>Todos los maestros</h2>
        <p style={s.subtitulo}>Encuentra al maestro que necesitas</p>

        <div style={s.lista}>
          {maestros.map((m) => (
            <div key={m.id} style={{
              ...s.fila,
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? 14 : 0,
            }}>
              <div style={s.filaIzq}>
                <div style={s.avatar}>{m.nombre?.[0]}</div>
                <div>
                  <p style={s.nombre}>{m.nombre}</p>
                  <p style={s.oficio}>{ICONOS[m.oficio] || '🔧'} &nbsp;{m.oficio}</p>
                  <p style={s.ubicacion}>
                    <FaMapMarkerAlt size={12} color="#1D9E75" /> &nbsp;{m.comuna}
                  </p>
                </div>
              </div>
              <div style={{
                ...s.filaDer,
                alignItems: isMobile ? 'flex-start' : 'flex-end',
                flexDirection: isMobile ? 'row' : 'column',
                flexWrap: 'wrap',
                width: isMobile ? '100%' : 'auto',
              }}>
                <span style={s.calificacion}>
                  <FaStar size={15} color="#EF9F27" />
                  &nbsp;{m.calificacion > 0 ? m.calificacion.toFixed(1) : '—'}
                </span>
                <button
                  onClick={() => navigate(`/maestros/${m.id}`)}
                  style={s.botonVer}
                >
                  Ver perfil →
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/maestros')} style={s.botonVerTodos}>
          Ver todos los maestros →
        </button>
      </div>
    </section>
  );
}

const s = {
  seccion: { backgroundColor: '#f8fffe', padding: '64px 24px', borderTop: '2px solid #b7e4ce' },
  inner: { maxWidth: 900, margin: '0 auto', textAlign: 'center' },
  titulo: { fontSize: 30, fontWeight: '800', color: '#0f2a22', margin: '0 0 10px' },
  subtitulo: { fontSize: 18, color: '#4b7062', marginBottom: 36 },
  lista: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, textAlign: 'left' },
  fila: {
    display: 'flex', justifyContent: 'space-between',
    backgroundColor: '#ffffff', border: '2px solid #b7e4ce',
    borderRadius: 14, padding: '16px 20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  filaIzq: { display: 'flex', alignItems: 'center', gap: 14 },
  filaDer: { display: 'flex', gap: 8 },
  avatar: {
    width: 52, height: 52, borderRadius: '50%',
    backgroundColor: '#1D9E75', color: '#ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, fontWeight: '800', flexShrink: 0,
  },
  nombre: { fontSize: 18, fontWeight: '700', color: '#0f2a22', margin: '0 0 3px' },
  oficio: { fontSize: 15, color: '#4b7062', margin: '0 0 3px' },
  ubicacion: { display: 'flex', alignItems: 'center', fontSize: 14, color: '#4b7062', margin: 0 },
  calificacion: {
    display: 'inline-flex', alignItems: 'center',
    fontSize: 16, fontWeight: '700', color: '#4b7062',
  },
  botonVer: {
    backgroundColor: 'transparent', border: '2px solid #1D9E75',
    color: '#1D9E75', borderRadius: 8, padding: '8px 16px',
    fontSize: 16, fontWeight: '700', cursor: 'pointer',
  },
  botonVerTodos: {
    padding: '14px 36px', backgroundColor: '#F97316', color: '#ffffff',
    border: 'none', borderRadius: 10, fontSize: 18, fontWeight: '700', cursor: 'pointer',
  },
};

export default TodosMaestros;
