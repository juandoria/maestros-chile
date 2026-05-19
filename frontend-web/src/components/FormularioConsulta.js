import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { inputBase } from '../styles/theme';

function FormularioConsulta({ maestroId, maestroNombre }) {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.mensaje) {
      setError('Completa todos los campos.');
      return;
    }
    setEnviando(true); setError('');
    try {
      await addDoc(collection(db, 'consultas'), {
        maestroId,
        maestroNombre,
        nombre:    form.nombre,
        email:     form.email,
        mensaje:   form.mensaje,
        respondido: false,
        creadoEn:  serverTimestamp(),
      });
      setExito(true);
      setForm({ nombre: '', email: '', mensaje: '' });
    } catch {
      setError('No se pudo enviar. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (exito) {
    return (
      <div style={s.exitoCaja}>
        <p style={{ fontSize: 36, margin: '0 0 8px' }}>✓</p>
        <p style={s.exitoTitulo}>¡Consulta enviada!</p>
        <p style={s.exitoDesc}>El maestro recibirá tu mensaje y te contactará pronto.</p>
        <button onClick={() => setExito(false)} style={s.botonOtro}>Enviar otra consulta</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleEnviar} style={s.form}>
      <div style={s.campo}>
        <label style={s.label}>Tu nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange}
          placeholder="Ej: María Torres" style={inputBase} />
      </div>
      <div style={s.campo}>
        <label style={s.label}>Tu correo</label>
        <input name="email" type="email" value={form.email} onChange={handleChange}
          placeholder="ejemplo@correo.com" style={inputBase} />
      </div>
      <div style={s.campo}>
        <label style={s.label}>Tu consulta</label>
        <textarea name="mensaje" value={form.mensaje} onChange={handleChange}
          placeholder="Escribe tu pregunta o duda aquí..."
          rows={4} style={{ ...inputBase, resize: 'vertical', minHeight: 90 }} />
      </div>
      {error && <p style={s.errorTexto}>⚠️ {error}</p>}
      <button type="submit" disabled={enviando} style={s.boton}>
        {enviando ? 'Enviando...' : '✉️  Enviar consulta'}
      </button>
    </form>
  );
}

const s = {
  form:       { display: 'flex', flexDirection: 'column', gap: 14 },
  campo:      { display: 'flex', flexDirection: 'column', gap: 6 },
  label:      { fontSize: 15, fontWeight: '700', color: '#0f2a22' },
  errorTexto: { fontSize: 14, color: '#dc2626', fontWeight: '600', margin: 0 },
  boton:      { padding: '14px', fontSize: 16, backgroundColor: '#1D9E75', color: '#fff', border: 'none', borderRadius: 10, fontWeight: '800', cursor: 'pointer' },
  exitoCaja:  { textAlign: 'center', padding: '24px 16px' },
  exitoTitulo:{ fontSize: 22, fontWeight: '800', color: '#085041', margin: '0 0 8px' },
  exitoDesc:  { fontSize: 16, color: '#4b7062', marginBottom: 20 },
  botonOtro:  { padding: '10px 20px', fontSize: 15, backgroundColor: 'transparent', color: '#1D9E75', border: '2px solid #1D9E75', borderRadius: 8, fontWeight: '700', cursor: 'pointer' },
};

export default FormularioConsulta;
