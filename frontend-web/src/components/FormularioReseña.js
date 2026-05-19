import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { createReseña } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIAS = [
  { key: 'puntualidad',      label: 'Puntualidad',          icono: '⏰' },
  { key: 'calidad',          label: 'Calidad del trabajo',  icono: '⭐' },
  { key: 'trato',            label: 'Trato y amabilidad',   icono: '😊' },
  { key: 'limpieza',         label: 'Limpieza',             icono: '🧹' },
  { key: 'precioJusto',      label: 'Precio justo',         icono: '💰' },
];

function FilaEstrellas({ label, icono, valor, onChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={s.fila}>
      <span style={s.filaLabel}>
        <span style={{ marginRight: 8 }}>{icono}</span>{label}
      </span>
      <div style={s.estrellasGrupo}>
        {[1, 2, 3, 4, 5].map((n) => (
          <FaStar
            key={n}
            size={28}
            style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
            color={(hover || valor) >= n ? '#F97316' : '#d1d5db'}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
          />
        ))}
      </div>
    </div>
  );
}

function FormularioReseña({ maestroId, onReseñaEnviada }) {
  const { usuario } = useAuth();
  const [categorias, setCategorias] = useState({
    puntualidad: 0, calidad: 0, trato: 0, limpieza: 0, precioJusto: 0,
  });
  const [comentario, setComentario] = useState('');
  const [nombre, setNombre] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');

  const todasCalificadas = Object.values(categorias).every((v) => v > 0);
  const promedio = todasCalificadas
    ? Math.round((Object.values(categorias).reduce((a, b) => a + b, 0) / 5) * 10) / 10
    : 0;

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!todasCalificadas) {
      setError('Por favor califica todas las categorías antes de enviar.');
      return;
    }
    setError('');
    setEnviando(true);
    try {
      await createReseña(maestroId, {
        calificacion:  promedio,
        categorias,
        comentario,
        clienteNombre: nombre || (usuario?.email?.split('@')[0]) || 'Cliente',
      });
      setExito(true);
      if (onReseñaEnviada) onReseñaEnviada();
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error. Intente de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (!usuario) {
    return (
      <div style={s.aviso}>
        <p style={s.avisoTexto}>🔒 Debes <a href="/login" style={s.link}>iniciar sesión</a> para dejar una reseña.</p>
      </div>
    );
  }

  if (exito) {
    return (
      <div style={s.exitoCaja}>
        <p style={{ fontSize: 40, margin: '0 0 10px' }}>🎉</p>
        <p style={s.exitoTexto}>¡Gracias por tu reseña! Tu opinión ayuda a otros usuarios.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleEnviar} style={s.form}>
      <p style={s.instruccion}>Califica cada aspecto del servicio:</p>

      {CATEGORIAS.map(({ key, label, icono }) => (
        <FilaEstrellas
          key={key}
          label={label}
          icono={icono}
          valor={categorias[key]}
          onChange={(val) => setCategorias({ ...categorias, [key]: val })}
        />
      ))}

      {todasCalificadas && (
        <div style={s.promedioFila}>
          <span style={s.promedioTexto}>Calificación general: </span>
          <span style={s.promedioValor}>{promedio.toFixed(1)} / 5</span>
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <label style={s.label}>Tu nombre (opcional)</label>
        <input
          type="text"
          placeholder="Ej: María González"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={s.input}
        />
      </div>

      <div style={{ marginTop: 14 }}>
        <label style={s.label}>Comentario (opcional)</label>
        <textarea
          placeholder="Cuéntanos cómo fue tu experiencia..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={3}
          style={{ ...s.input, resize: 'vertical', minHeight: 80 }}
        />
      </div>

      {error && <p style={s.errorTexto}>⚠️ {error}</p>}

      <button
        type="submit"
        disabled={enviando || !todasCalificadas}
        style={{
          ...s.boton,
          opacity: (!todasCalificadas || enviando) ? 0.5 : 1,
          cursor: (!todasCalificadas || enviando) ? 'not-allowed' : 'pointer',
        }}
      >
        {enviando ? 'Enviando...' : '✓  Enviar reseña'}
      </button>
    </form>
  );
}

const s = {
  form: { display: 'flex', flexDirection: 'column', gap: 4 },
  instruccion: { fontSize: 17, color: '#4b7062', margin: '0 0 14px', fontWeight: '600' },
  fila: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 0', borderBottom: '1px solid #f0fdf8',
  },
  filaLabel: { fontSize: 17, fontWeight: '600', color: '#0f2a22' },
  estrellasGrupo: { display: 'flex', gap: 6 },
  promedioFila: {
    display: 'flex', alignItems: 'center', gap: 8,
    backgroundColor: '#fff7ed', border: '2px solid #fed7aa',
    borderRadius: 10, padding: '10px 16px', marginTop: 10,
  },
  promedioTexto: { fontSize: 16, color: '#0f2a22', fontWeight: '600' },
  promedioValor: { fontSize: 20, fontWeight: '900', color: '#F97316' },
  label: { display: 'block', fontSize: 16, fontWeight: '700', color: '#0f2a22', marginBottom: 6 },
  input: {
    width: '100%', padding: '12px 16px', fontSize: 16,
    border: '2px solid #b7e4ce', borderRadius: 10,
    outline: 'none', color: '#0f2a22', fontFamily: 'inherit',
    boxSizing: 'border-box', backgroundColor: '#fff',
  },
  errorTexto: { fontSize: 16, color: '#dc2626', margin: '8px 0 0', fontWeight: '600' },
  boton: {
    marginTop: 18, padding: '15px', fontSize: 18,
    backgroundColor: '#F97316', color: '#fff',
    border: 'none', borderRadius: 10, fontWeight: '800',
  },
  aviso: {
    backgroundColor: '#f0fdf8', border: '2px solid #b7e4ce',
    borderRadius: 12, padding: '18px 20px', textAlign: 'center',
  },
  avisoTexto: { fontSize: 17, color: '#0f2a22', margin: 0 },
  link: { color: '#1D9E75', fontWeight: '700' },
  exitoCaja: {
    textAlign: 'center', backgroundColor: '#f0fdf8',
    border: '2px solid #1D9E75', borderRadius: 14, padding: '28px 20px',
  },
  exitoTexto: { fontSize: 18, color: '#085041', fontWeight: '600', margin: 0 },
};

export default FormularioReseña;
