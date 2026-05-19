import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { useResponsive } from '../hooks/useResponsive';

const SUGERENCIAS = [
  'Electricista', 'Gasfíter', 'Carpintero', 'Pintor',
  'Albañil', 'Cerrajero', 'Técnico en calefacción',
];

function HeroSection() {
  const [busqueda, setBusqueda] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [detectando, setDetectando] = useState(false);
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const handleBuscar = (e) => {
    e.preventDefault();
    if (!busqueda.trim()) return;
    const params = new URLSearchParams({ oficio: busqueda.trim() });
    navigate(`/maestros?${params.toString()}`);
  };

  const detectarUbicacion = () => {
    if (!navigator.geolocation) {
      setUbicacion('Tu navegador no permite detectar ubicación');
      return;
    }
    setDetectando(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setUbicacion('📍 Ubicación detectada — mostrando maestros cercanos');
        setDetectando(false);
      },
      () => {
        setUbicacion('No fue posible detectar tu ubicación');
        setDetectando(false);
      }
    );
  };

  return (
    <section style={{ ...s.hero, padding: isMobile ? '40px 16px 32px' : '64px 24px 56px' }}>
      <div style={s.inner}>
        <h1 style={{ ...s.titulo, fontSize: isMobile ? 28 : 40 }}>
          ¿Qué maestro necesitas hoy?
        </h1>
        <p style={{ ...s.subtitulo, fontSize: isMobile ? 16 : 20, marginBottom: isMobile ? 24 : 36 }}>
          Gasfíter, electricista, carpintero y más — cerca de ti
        </p>

        <form onSubmit={handleBuscar} style={s.buscadorFila}>
          <div style={s.inputWrapper}>
            <FaSearch style={s.inputIcono} size={isMobile ? 17 : 20} color="#1D9E75" />
            <input
              list="oficios-list"
              type="text"
              placeholder="¿Qué necesita? Ej: Gasfíter"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                ...s.input,
                padding: isMobile ? '14px 14px 14px 40px' : '18px 18px 18px 48px',
                fontSize: isMobile ? 16 : 19,
              }}
              autoComplete="off"
            />
            <datalist id="oficios-list">
              {SUGERENCIAS.map((o) => <option key={o} value={o} />)}
            </datalist>
          </div>
          <button type="submit" style={{
            ...s.botonBuscar,
            padding: isMobile ? '0 18px' : '0 32px',
            fontSize: isMobile ? 16 : 19,
          }}>
            Buscar
          </button>
        </form>

        <div style={s.ubicacionFila}>
          {ubicacion ? (
            <span style={s.ubicacionTexto}>{ubicacion}</span>
          ) : (
            <button onClick={detectarUbicacion} disabled={detectando} style={s.botonUbicacion}>
              <FaMapMarkerAlt size={16} />
              &nbsp;{detectando ? 'Detectando...' : 'Detectar mi ubicación'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

const s = {
  hero: { background: 'linear-gradient(135deg, #1D9E75 0%, #085041 100%)', borderBottom: 'none' },
  inner: { maxWidth: 760, margin: '0 auto', textAlign: 'center' },
  titulo: { fontWeight: '900', color: '#ffffff', margin: '0 0 14px', lineHeight: 1.15 },
  subtitulo: { color: 'rgba(255,255,255,0.85)', margin: 0 },
  buscadorFila: {
    display: 'flex', gap: 0, borderRadius: 12,
    boxShadow: '0 6px 28px rgba(0,0,0,0.25)',
    overflow: 'hidden', border: '2px solid rgba(255,255,255,0.3)',
    backgroundColor: '#ffffff',
  },
  inputWrapper: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcono: { position: 'absolute', left: 14, pointerEvents: 'none' },
  input: { width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent', color: '#0f2a22', fontFamily: 'inherit' },
  botonBuscar: {
    backgroundColor: '#F97316', color: '#ffffff',
    border: 'none', cursor: 'pointer', fontWeight: '800', whiteSpace: 'nowrap', flexShrink: 0,
  },
  ubicacionFila: { marginTop: 18 },
  botonUbicacion: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'none', border: 'none', color: 'rgba(255,255,255,0.9)',
    fontSize: 17, fontWeight: '700', cursor: 'pointer',
    padding: '6px 12px', borderRadius: 8, textDecoration: 'underline',
  },
  ubicacionTexto: { fontSize: 17, color: '#ffffff', fontWeight: '700' },
};

export default HeroSection;
