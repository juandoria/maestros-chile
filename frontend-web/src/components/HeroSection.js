import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const SUGERENCIAS = [
  'Electricista', 'Gasfíter', 'Carpintero', 'Pintor',
  'Albañil', 'Cerrajero', 'Técnico en calefacción',
];

function HeroSection() {
  const [busqueda, setBusqueda] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [detectando, setDetectando] = useState(false);
  const navigate = useNavigate();

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
    <section style={s.hero}>
      <div style={s.inner}>
        <h1 style={s.titulo}>¿Qué maestro necesitas hoy?</h1>
        <p style={s.subtitulo}>
          Gasfíter, electricista, carpintero y más — cerca de ti
        </p>

        <form onSubmit={handleBuscar} style={s.buscadorFila}>
          <div style={s.inputWrapper}>
            <FaSearch style={s.inputIcono} size={20} color="#1D9E75" />
            <input
              list="oficios-list"
              type="text"
              placeholder="¿Qué necesita? Ej: Gasfíter"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={s.input}
              autoComplete="off"
            />
            <datalist id="oficios-list">
              {SUGERENCIAS.map((o) => <option key={o} value={o} />)}
            </datalist>
          </div>
          <button type="submit" style={s.botonBuscar}>
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
  hero: {
    backgroundColor: '#E1F5EE',
    padding: '64px 24px 56px',
    borderBottom: '3px solid #b7e4ce',
  },
  inner: { maxWidth: 760, margin: '0 auto', textAlign: 'center' },
  titulo: {
    fontSize: 40, fontWeight: '900', color: '#0f2a22',
    margin: '0 0 14px', lineHeight: 1.15,
  },
  subtitulo: {
    fontSize: 20, color: '#4b7062', margin: '0 0 36px',
  },
  buscadorFila: {
    display: 'flex', gap: 0, borderRadius: 12,
    boxShadow: '0 4px 20px rgba(29,158,117,0.25)',
    overflow: 'hidden',
    border: '2px solid #1D9E75',
    backgroundColor: '#ffffff',
  },
  inputWrapper: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcono: { position: 'absolute', left: 16, pointerEvents: 'none' },
  input: {
    width: '100%', padding: '18px 18px 18px 48px',
    fontSize: 19, border: 'none', outline: 'none',
    backgroundColor: 'transparent', color: '#0f2a22',
    fontFamily: 'inherit',
  },
  botonBuscar: {
    padding: '0 32px',
    backgroundColor: '#1D9E75', color: '#ffffff',
    border: 'none', cursor: 'pointer',
    fontSize: 19, fontWeight: '800',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  ubicacionFila: { marginTop: 18 },
  botonUbicacion: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'none', border: 'none',
    color: '#1D9E75', fontSize: 17, fontWeight: '700',
    cursor: 'pointer', padding: '6px 12px',
    borderRadius: 8, textDecoration: 'underline',
  },
  ubicacionTexto: { fontSize: 17, color: '#1D9E75', fontWeight: '700' },
};

export default HeroSection;
