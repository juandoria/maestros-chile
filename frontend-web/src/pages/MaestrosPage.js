import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { getMaestros } from '../services/api';
import { useResponsive } from '../hooks/useResponsive';

const ICONOS = {
  'Electricista': '⚡', 'Gasfíter': '🔧', 'Carpintero': '🪚',
  'Pintor': '🎨', 'Albañil': '🧱', 'Cerrajero': '🔑',
  'Técnico en calefacción': '🔥', 'Jardinero': '🌿',
};

function MaestrosPage() {
  const [searchParams] = useSearchParams();
  const [maestros, setMaestros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const oficio = searchParams.get('oficio') || '';
  const comuna = searchParams.get('comuna') || '';

  useEffect(() => {
    setCargando(true);
    getMaestros(oficio, comuna)
      .then((res) => setMaestros(res.data))
      .catch(() => setError('Hubo un problema al buscar maestros.\nRevise su conexión e intente de nuevo.'))
      .finally(() => setCargando(false));
  }, [oficio, comuna]);

  if (cargando) {
    return (
      <div style={s.centrado}>
        <p style={s.cargandoTexto}>🔍 Buscando maestros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={s.centrado}>
        <div style={s.errorCaja}>
          <p style={{ fontSize: 48, margin: '0 0 12px' }}>⚠️</p>
          <p style={s.errorTexto}>{error}</p>
          <button onClick={() => window.location.reload()} style={s.botonNaranja}>
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...s.pagina, padding: isMobile ? '24px 16px 60px' : '36px 24px 80px' }}>
      <div style={{ ...s.encabezado, gap: isMobile ? 10 : 16 }}>
        <span style={{ fontSize: isMobile ? 32 : 44 }}>{ICONOS[oficio] || '🔧'}</span>
        <div>
          <h2 style={{ ...s.titulo, fontSize: isMobile ? 22 : 30 }}>
            {oficio || 'Todos los maestros'}
          </h2>
          {comuna && (
            <p style={s.ubicacion}>
              <FaMapMarkerAlt size={15} color="#1D9E75" /> &nbsp;{comuna}
            </p>
          )}
        </div>
      </div>

      <button onClick={() => navigate('/')} style={s.botonVolver}>
        ← Nueva búsqueda
      </button>

      {maestros.length === 0 ? (
        <div style={s.vacioCaja}>
          <p style={{ fontSize: 52, margin: '0 0 16px' }}>😔</p>
          <p style={s.vacioTitulo}>No encontramos maestros disponibles</p>
          <p style={s.vacioDesc}>Intente buscando sin filtro de comuna o con otro oficio.</p>
          <button onClick={() => navigate('/')} style={s.botonNaranja}>
            Hacer otra búsqueda
          </button>
        </div>
      ) : (
        <>
          <p style={s.conteo}>
            {maestros.length} maestro{maestros.length !== 1 ? 's' : ''} encontrado{maestros.length !== 1 ? 's' : ''}
          </p>
          <div style={s.lista}>
            {maestros.map((m) => {
              const oficios = m.oficios?.length ? m.oficios : (m.oficio ? [m.oficio] : []);
              return (
                <button
                  key={m.id}
                  onClick={() => navigate(`/maestros/${m.id}`)}
                  style={{
                    ...s.tarjeta,
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? 12 : 0,
                  }}
                >
                  <div style={s.tarjetaIzq}>
                    {/* Foto real o inicial */}
                    {m.fotoUrl ? (
                      <img src={m.fotoUrl} alt={m.nombre} style={s.fotoAvatar} />
                    ) : (
                      <div style={s.avatar}>{m.nombre?.[0]}</div>
                    )}
                    <div>
                      <p style={s.nombre}>{m.nombre}</p>
                      {/* Múltiples oficios */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                        {oficios.map((o) => (
                          <span key={o} style={s.oficioTag}>
                            {ICONOS[o] || '🔧'} {o}
                          </span>
                        ))}
                      </div>
                      <p style={s.precio}>${m.precioPorHora?.toLocaleString('es-CL')} / hora</p>
                    </div>
                  </div>
                  <div style={{
                    ...s.tarjetaDer,
                    alignItems: isMobile ? 'flex-start' : 'flex-end',
                    flexDirection: isMobile ? 'row' : 'column',
                    flexWrap: 'wrap',
                    width: isMobile ? '100%' : 'auto',
                  }}>
                    <span style={s.estrellas}>
                      <FaStar size={15} color="#EF9F27" />
                      &nbsp;{m.calificacion > 0 ? m.calificacion.toFixed(1) : '—'}
                    </span>
                    {m.disponible
                      ? <span style={s.disponible}>✓ Disponible</span>
                      : <span style={s.noDisponible}>No disponible</span>}
                    <span style={s.verPerfil}>Ver perfil →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

const s = {
  pagina: { maxWidth: 800, margin: '0 auto', minHeight: 'calc(100vh - 140px)' },
  centrado: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: 24 },
  encabezado: { display: 'flex', alignItems: 'center', marginBottom: 20 },
  titulo: { fontWeight: '800', color: '#0f2a22', margin: '0 0 4px' },
  ubicacion: { display: 'flex', alignItems: 'center', fontSize: 17, color: '#4b7062', margin: 0 },
  botonVolver: {
    background: 'none', border: '2px solid #1D9E75', borderRadius: 10,
    color: '#1D9E75', fontSize: 18, fontWeight: '700', padding: '10px 20px',
    cursor: 'pointer', marginBottom: 24,
  },
  conteo: { fontSize: 17, color: '#4b7062', marginBottom: 18 },
  lista: { display: 'flex', flexDirection: 'column', gap: 14 },
  tarjeta: {
    display: 'flex', justifyContent: 'space-between',
    padding: '18px 22px', backgroundColor: '#ffffff',
    border: '2px solid #b7e4ce', borderRadius: 16,
    cursor: 'pointer', textAlign: 'left', width: '100%',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    boxSizing: 'border-box',
  },
  tarjetaIzq: { display: 'flex', alignItems: 'center', gap: 16 },
  tarjetaDer: { display: 'flex', gap: 7 },
  fotoAvatar: {
    width: 56, height: 56, borderRadius: '50%',
    objectFit: 'cover', border: '2px solid #b7e4ce', flexShrink: 0,
  },
  avatar: {
    width: 56, height: 56, borderRadius: '50%', backgroundColor: '#1D9E75',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 24, fontWeight: '800', flexShrink: 0,
  },
  nombre: { fontSize: 19, fontWeight: '700', color: '#0f2a22', margin: '0 0 4px' },
  oficioTag: {
    display: 'inline-block',
    backgroundColor: '#E1F5EE', color: '#085041',
    borderRadius: 12, padding: '2px 10px',
    fontSize: 13, fontWeight: '600',
  },
  precio: { fontSize: 17, fontWeight: '700', color: '#1D9E75', margin: '4px 0 0' },
  estrellas: { display: 'inline-flex', alignItems: 'center', fontSize: 15, fontWeight: '700', color: '#4b7062' },
  disponible: { fontSize: 15, color: '#085041', fontWeight: '700' },
  noDisponible: { fontSize: 15, color: '#9ca3af' },
  verPerfil: { fontSize: 16, color: '#1D9E75', fontWeight: '700' },
  cargandoTexto: { fontSize: 22, color: '#4b7062' },
  errorCaja: { textAlign: 'center', maxWidth: 400 },
  errorTexto: { fontSize: 18, color: '#dc2626', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: 20 },
  vacioCaja: { textAlign: 'center', padding: '40px 20px' },
  vacioTitulo: { fontSize: 22, fontWeight: '700', color: '#0f2a22', marginBottom: 10 },
  vacioDesc: { fontSize: 18, color: '#4b7062', marginBottom: 28 },
  botonNaranja: {
    padding: '14px 28px', backgroundColor: '#F97316', color: '#fff',
    border: 'none', borderRadius: 10, fontSize: 18, fontWeight: '700', cursor: 'pointer',
  },
};

export default MaestrosPage;
