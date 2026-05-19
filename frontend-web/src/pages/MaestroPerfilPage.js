import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { getMaestroById, getReseñas } from '../services/api';
import { useResponsive } from '../hooks/useResponsive';
import FormularioReseña from '../components/FormularioReseña';
import ContactoMaestro from '../components/ContactoMaestro';

const ICONOS = {
  'Electricista': '⚡', 'Gasfíter': '🔧', 'Carpintero': '🪚',
  'Pintor': '🎨', 'Albañil': '🧱', 'Cerrajero': '🔑',
  'Técnico en calefacción': '🔥', 'Jardinero': '🌿',
};

const DIAS_ORDEN = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const DIAS_LABELS = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié',
  jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom',
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

const LABELS_CATEGORIAS = {
  puntualidad: '⏰ Puntualidad',
  calidad:     '⭐ Calidad',
  trato:       '😊 Trato',
  limpieza:    '🧹 Limpieza',
  precioJusto: '💰 Precio',
};

function HorarioPublico({ horario }) {
  if (!horario) return null;
  const diasActivos = DIAS_ORDEN.filter((d) => horario[d]?.activo);
  if (diasActivos.length === 0) return <p style={{ color: '#9ca3af', fontSize: 15 }}>Sin horario definido</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {DIAS_ORDEN.map((key) => {
        const dia = horario[key];
        return (
          <div key={key} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 12px', borderRadius: 10,
            backgroundColor: dia?.activo ? '#f0fdf8' : '#f9fafb',
            border: `1.5px solid ${dia?.activo ? '#b7e4ce' : '#e5e7eb'}`,
          }}>
            <span style={{
              width: 36, fontSize: 14, fontWeight: '700',
              color: dia?.activo ? '#085041' : '#9ca3af',
            }}>
              {DIAS_LABELS[key]}
            </span>
            {dia?.activo ? (
              <span style={{ fontSize: 15, color: '#0f2a22', fontWeight: '600' }}>
                {dia.desde} → {dia.hasta}
              </span>
            ) : (
              <span style={{ fontSize: 14, color: '#9ca3af' }}>No disponible</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MaestroPerfilPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maestro, setMaestro] = useState(null);
  const [reseñas, setReseñas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { isMobile } = useResponsive();

  const cargarReseñas = useCallback(() => {
    getReseñas(id).then((res) => setReseñas(res.data)).catch(() => {});
  }, [id]);

  useEffect(() => {
    getMaestroById(id)
      .then((res) => setMaestro(res.data))
      .catch(() => setError('No pudimos cargar el perfil.\nVuelva atrás e intente de nuevo.'))
      .finally(() => setCargando(false));
    cargarReseñas();
  }, [id, cargarReseñas]);

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

  // Normaliza oficios: soporta array nuevo o string legado
  const oficios = maestro.oficios?.length ? maestro.oficios : (maestro.oficio ? [maestro.oficio] : []);
  const oficioLabel = oficios.join(' · ') || '—';

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
          {/* Avatar: foto real o inicial */}
          {maestro.fotoUrl ? (
            <img src={maestro.fotoUrl} alt={maestro.nombre} style={{
              ...s.fotoAvatar,
              width: isMobile ? 80 : 100,
              height: isMobile ? 80 : 100,
            }} />
          ) : (
            <div style={{
              ...s.avatar,
              width: isMobile ? 64 : 80,
              height: isMobile ? 64 : 80,
              fontSize: isMobile ? 28 : 36,
            }}>
              {maestro.nombre?.[0]}
            </div>
          )}

          <div style={{ flex: 1 }}>
            <h1 style={{ ...s.nombre, fontSize: isMobile ? 22 : 26 }}>{maestro.nombre}</h1>

            {/* Oficios (puede ser múltiple) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6, justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {oficios.map((o) => (
                <span key={o} style={s.oficioChip}>
                  {ICONOS[o] || '🔧'} {o}
                </span>
              ))}
            </div>

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

      {/* Horario semanal */}
      {maestro.horario && (
        <div style={s.seccion}>
          <p style={s.seccionLabel}>📅 Disponibilidad semanal</p>
          <HorarioPublico horario={maestro.horario} />
        </div>
      )}

      {/* Contacto: Chat / Cotización / Consulta */}
      <div style={s.seccionContacto}>
        <p style={s.seccionLabel}>📞 Contactar al maestro</p>
        <ContactoMaestro
          maestroId={id}
          maestroNombre={maestro.nombre}
          oficios={oficios}
        />
      </div>

      {/* Reseñas existentes */}
      {reseñas.length > 0 && (
        <div style={s.seccion}>
          <p style={s.seccionLabel}>💬 Reseñas ({reseñas.length})</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {reseñas.map((r) => (
              <div key={r.id} style={s.reseñaCard}>
                <div style={s.reseñaEncabezado}>
                  <strong style={s.reseñaAutor}>{r.clienteNombre}</strong>
                  <span style={s.reseñaFecha}>
                    {new Date(r.creadoEn).toLocaleDateString('es-CL')}
                  </span>
                </div>
                {r.categorias && Object.keys(r.categorias).length > 0 && (
                  <div style={s.categoriasGrid}>
                    {Object.entries(r.categorias).map(([key, val]) => (
                      <div key={key} style={s.categoriaItem}>
                        <span style={s.categoriaLabel}>{LABELS_CATEGORIAS[key] || key}</span>
                        <span style={s.categoriaValor}>
                          {[1,2,3,4,5].map((n) => (
                            <FaStar key={n} size={13} color={n <= val ? '#F97316' : '#d1d5db'} />
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {r.comentario && <p style={s.reseñaComentario}>"{r.comentario}"</p>}
                <div style={s.reseñaPromedio}>
                  <FaStar size={15} color="#F97316" />
                  <span style={{ marginLeft: 5, fontWeight: '800', color: '#F97316' }}>
                    {r.calificacion.toFixed(1)}
                  </span>
                  <span style={{ marginLeft: 4, color: '#4b7062', fontSize: 14 }}>promedio</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulario nueva reseña */}
      <div style={s.seccion}>
        <p style={s.seccionLabel}>✍️ Dejar una reseña</p>
        <FormularioReseña
          maestroId={id}
          onReseñaEnviada={() => {
            cargarReseñas();
            getMaestroById(id).then((res) => setMaestro(res.data)).catch(() => {});
          }}
        />
      </div>
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
  fotoAvatar: {
    borderRadius: '50%', objectFit: 'cover',
    border: '3px solid #b7e4ce', flexShrink: 0,
  },
  avatar: {
    borderRadius: '50%', backgroundColor: '#1D9E75', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '800', flexShrink: 0,
  },
  nombre: { fontWeight: '800', color: '#0f2a22', margin: '0 0 8px' },
  oficioChip: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    backgroundColor: '#E1F5EE', color: '#085041',
    borderRadius: 20, padding: '4px 12px',
    fontSize: 15, fontWeight: '700',
  },
  ubicacion: { display: 'flex', alignItems: 'center', fontSize: 16, color: '#4b7062', margin: '6px 0 0' },
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
  seccionLabel: { fontSize: 17, color: '#4b7062', margin: '0 0 12px', fontWeight: '700' },
  precioValor: { fontWeight: '900', color: '#1D9E75', margin: 0 },
  descripcion: { fontSize: 18, color: '#0f2a22', lineHeight: 1.7, margin: 0 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#E1F5EE', color: '#085041',
    borderRadius: 20, padding: '6px 14px',
    fontSize: 15, fontWeight: '700',
  },
  seccionContacto: { marginBottom: 16 },
  reseñaCard: {
    backgroundColor: '#fafafa', border: '1.5px solid #e5e7eb',
    borderRadius: 12, padding: '14px 18px',
  },
  reseñaEncabezado: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  reseñaAutor: { fontSize: 16, color: '#0f2a22' },
  reseñaFecha: { fontSize: 13, color: '#9ca3af' },
  categoriasGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', marginBottom: 10 },
  categoriaItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  categoriaLabel: { fontSize: 13, color: '#4b7062' },
  categoriaValor: { display: 'inline-flex', gap: 2 },
  reseñaComentario: { fontSize: 15, color: '#4b7062', fontStyle: 'italic', margin: '8px 0' },
  reseñaPromedio: { display: 'flex', alignItems: 'center', marginTop: 8 },
};

export default MaestroPerfilPage;
