import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { getMaestroById } from '../services/api';
import { useResponsive } from '../hooks/useResponsive';

const ICONOS = {
  'Electricista': '⚡', 'Gasfíter': '🔧', 'Carpintero': '🪚',
  'Pintor': '🎨', 'Albañil': '🧱', 'Cerrajero': '🔑',
  'Técnico en calefacción': '🔥', 'Jardinero': '🌿',
};

function Estrellas({ valor }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar key={i} size={20} color={i <= Math.round(valor) ? '#EF9F27' : '#d1d5db'} />
      ))}
      <span style={{ marginLeft: 8, fontSize: 17, color: '#4b7062', fontWeight: '700' }}>
        {valor > 0 ? valor.toFixed(1) : 'Sin calificaciones aún'}
      </span>
    </span>
  );
}

function MaestroPerfilPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maestro, setMaestro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { isMobile } = useResponsive();

  useEffect(() => {
    getMaestroById(id)
      .then((res) => setMaestro(res.data))
      .catch(() => setError('No pudimos cargar el perfil.\nVuelva atrás e intente de nuevo.'))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) {
    return <div style={s.centrado}><p style={s.cargando}>Cargando perfil...</p></div>;
  }

  if (error) {
    return (
      <div style={s.centrado}>
        <p style={{ fontSize: 48, margin: '0 0 16px' }}>⚠️</p>
        <p style={s.errorTexto}>{error}</p>
        <button onClick={() => navigate(-1)} style={s.botonVolver}>← Volver atrás</button>
      </div>
    );
  }

  const mensajeWsp = encodeURIComponent(
    `Hola ${maestro.nombre}, lo encontré en Maestros Chile y necesito un ${maestro.oficio}. ¿Podría ayudarme?`
  );

  return (
    <div style={{ ...s.pagina, padding: isMobile ? '24px 16px 60px' : '32px 24px 80px' }}>
      <button onClick={() => navigate(-1)} style={s.botonVolver}>
        ← Volver a resultados
      </button>

      {/* Tarjeta principal */}
      <div style={s.tarjeta}>
        <div style={{
          ...s.encabezado,
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left',
        }}>
          <div style={{
            ...s.avatar,
            width: isMobile ? 64 : 80,
            height: isMobile ? 64 : 80,
            fontSize: isMobile ? 28 : 36,
          }}>
            {maestro.nombre?.[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ ...s.nombre, fontSize: isMobile ? 22 : 26 }}>{maestro.nombre}</h1>
            <p style={s.oficio}>
              <span>{ICONOS[maestro.oficio] || '🔧'}</span>
              &nbsp;{maestro.oficio}
            </p>
            <p style={{ ...s.ubicacion, justifyContent: isMobile ? 'center' : 'flex-start' }}>
              <FaMapMarkerAlt size={15} color="#1D9E75" /> &nbsp;{maestro.comuna}
            </p>
            <div style={{ marginTop: 10 }}>
              <Estrellas valor={maestro.calificacion || 0} />
            </div>
          </div>
        </div>

        <div style={maestro.disponible ? s.badgeDisponible : s.badgeNoDisponible}>
          {maestro.disponible ? '✓  Disponible ahora' : '✗  No disponible en este momento'}
        </div>
      </div>

      {/* Precio */}
      <div style={s.seccion}>
        <p style={s.seccionLabel}>💰 Precio por hora</p>
        <p style={{ ...s.precioValor, fontSize: isMobile ? 28 : 34 }}>
          ${maestro.precioPorHora?.toLocaleString('es-CL')} CLP
        </p>
      </div>

      {/* Descripción */}
      {maestro.descripcion && (
        <div style={s.seccion}>
          <p style={s.seccionLabel}>📝 Sobre el maestro</p>
          <p style={s.descripcion}>{maestro.descripcion}</p>
        </div>
      )}

      {/* Especialidades */}
      {maestro.especialidades?.length > 0 && (
        <div style={s.seccion}>
          <p style={s.seccionLabel}>🛠 Especialidades</p>
          <div style={s.chips}>
            {maestro.especialidades.map((e) => (
              <span key={e} style={s.chip}>{e}</span>
            ))}
          </div>
        </div>
      )}

      {/* Botón WhatsApp */}
      <a
        href={`https://wa.me/56?text=${mensajeWsp}`}
        target="_blank"
        rel="noreferrer"
        style={{ ...s.botonWsp, fontSize: isMobile ? 18 : 21, padding: isMobile ? '16px 20px' : '20px 32px' }}
      >
        <FaWhatsapp size={isMobile ? 22 : 26} />
        &nbsp; Contactar por WhatsApp
      </a>

      <p style={s.ayuda}>
        Al hacer clic se abrirá WhatsApp para escribirle directamente al maestro.
      </p>
    </div>
  );
}

const s = {
  pagina: { maxWidth: 640, margin: '0 auto', minHeight: 'calc(100vh - 140px)' },
  centrado: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: 24, textAlign: 'center' },
  cargando: { fontSize: 22, color: '#4b7062' },
  errorTexto: { fontSize: 18, color: '#dc2626', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: 20 },
  botonVolver: {
    background: 'none', border: '2px solid #1D9E75', borderRadius: 10,
    color: '#1D9E75', fontSize: 18, fontWeight: '700', padding: '10px 20px',
    cursor: 'pointer', marginBottom: 24, display: 'inline-block',
  },
  tarjeta: {
    backgroundColor: '#ffffff', border: '2px solid #b7e4ce',
    borderRadius: 18, padding: 24, marginBottom: 18,
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
  },
  encabezado: { display: 'flex', gap: 20, marginBottom: 18 },
  avatar: {
    borderRadius: '50%', backgroundColor: '#1D9E75', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '800', flexShrink: 0,
  },
  nombre: { fontWeight: '800', color: '#0f2a22', margin: '0 0 6px' },
  oficio: { fontSize: 19, color: '#0f2a22', margin: '0 0 4px', fontWeight: '600' },
  ubicacion: { display: 'flex', alignItems: 'center', fontSize: 16, color: '#4b7062', margin: 0 },
  badgeDisponible: {
    display: 'inline-block', backgroundColor: '#E1F5EE', color: '#085041',
    border: '2px solid #1D9E75', borderRadius: 10, padding: '10px 18px',
    fontSize: 18, fontWeight: '700',
  },
  badgeNoDisponible: {
    display: 'inline-block', backgroundColor: '#f3f4f6', color: '#6b7280',
    border: '2px solid #e5e7eb', borderRadius: 10, padding: '10px 18px',
    fontSize: 18, fontWeight: '700',
  },
  seccion: {
    backgroundColor: '#ffffff', border: '2px solid #b7e4ce',
    borderRadius: 16, padding: '18px 24px', marginBottom: 16,
  },
  seccionLabel: { fontSize: 17, color: '#4b7062', margin: '0 0 8px', fontWeight: '700' },
  precioValor: { fontWeight: '900', color: '#1D9E75', margin: 0 },
  descripcion: { fontSize: 18, color: '#0f2a22', lineHeight: 1.7, margin: 0 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#E1F5EE', color: '#085041',
    borderRadius: 20, padding: '6px 14px',
    fontSize: 15, fontWeight: '700',
  },
  botonWsp: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    textDecoration: 'none', backgroundColor: '#1D9E75', color: '#ffffff',
    borderRadius: 14, fontWeight: '800',
    boxShadow: '0 4px 16px rgba(29,158,117,0.35)',
    marginBottom: 14,
  },
  ayuda: { textAlign: 'center', fontSize: 16, color: '#4b7062', lineHeight: 1.5 },
};

export default MaestroPerfilPage;
