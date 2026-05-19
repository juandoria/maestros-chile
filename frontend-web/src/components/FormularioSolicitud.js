import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { inputBase } from '../styles/theme';

function FormularioSolicitud({ maestroId, maestroNombre, oficios }) {
  const { usuario } = useAuth();
  const [form, setForm] = useState({
    descripcion: '', fechaTentativa: '', telefono: '', direccion: '', oficio: oficios?.[0] || '',
  });
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!form.descripcion || !form.telefono) {
      setError('Completa al menos la descripción y tu teléfono.');
      return;
    }
    setEnviando(true); setError('');
    try {
      await addDoc(collection(db, 'solicitudes'), {
        maestroId,
        maestroNombre,
        clienteId:     usuario?.uid || null,
        clienteNombre: usuario?.displayName || 'Cliente',
        clienteEmail:  usuario?.email || '',
        oficio:        form.oficio,
        descripcion:   form.descripcion,
        fechaTentativa: form.fechaTentativa || null,
        telefono:      form.telefono,
        direccion:     form.direccion,
        estado:        'pendiente',
        creadoEn:      serverTimestamp(),
      });
      setExito(true);
      setForm({ descripcion: '', fechaTentativa: '', telefono: '', direccion: '', oficio: oficios?.[0] || '' });
    } catch {
      setError('No se pudo enviar. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (!usuario) {
    return (
      <div style={s.loginAviso}>
        <p style={{ fontSize: 36, margin: '0 0 8px' }}>🔒</p>
        <p style={s.loginTitulo}>Inicia sesión para solicitar cotización</p>
        <p style={s.loginDesc}>Necesitas una cuenta para que el maestro pueda responderte.</p>
        <a href="/login" style={s.botonLogin}>Ingresar / Crear cuenta</a>
      </div>
    );
  }

  if (exito) {
    return (
      <div style={s.exitoCaja}>
        <p style={{ fontSize: 36, margin: '0 0 8px' }}>📋</p>
        <p style={s.exitoTitulo}>¡Solicitud enviada!</p>
        <p style={s.exitoDesc}>El maestro revisará tu solicitud y te contactará pronto.</p>
        <button onClick={() => setExito(false)} style={s.botonOtro}>Enviar otra solicitud</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleEnviar} style={s.form}>

      {/* Oficio si tiene más de uno */}
      {oficios?.length > 1 && (
        <div style={s.campo}>
          <label style={s.label}>¿Para qué oficio necesitas cotización?</label>
          <select name="oficio" value={form.oficio} onChange={handleChange}
            style={{ ...inputBase, backgroundColor: '#fff' }}>
            {oficios.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      )}

      <div style={s.campo}>
        <label style={s.label}>Descripción del trabajo *</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
          placeholder="Describe el trabajo que necesitas: qué, dónde, qué tan urgente..."
          rows={4} style={{ ...inputBase, resize: 'vertical', minHeight: 90 }} />
      </div>

      <div style={s.campo}>
        <label style={s.label}>Tu teléfono *</label>
        <input name="telefono" value={form.telefono} onChange={handleChange}
          placeholder="+56 9 1234 5678" style={inputBase} />
      </div>

      <div style={s.campo}>
        <label style={s.label}>Dirección del trabajo</label>
        <input name="direccion" value={form.direccion} onChange={handleChange}
          placeholder="Ej: Av. Principal 1234, Peñalolén" style={inputBase} />
      </div>

      <div style={s.campo}>
        <label style={s.label}>Fecha tentativa</label>
        <input name="fechaTentativa" type="date" value={form.fechaTentativa}
          onChange={handleChange} style={inputBase}
          min={new Date().toISOString().split('T')[0]} />
      </div>

      {error && <p style={s.errorTexto}>⚠️ {error}</p>}
      <button type="submit" disabled={enviando} style={s.boton}>
        {enviando ? 'Enviando...' : '📋  Solicitar cotización'}
      </button>
    </form>
  );
}

const s = {
  form:       { display: 'flex', flexDirection: 'column', gap: 14 },
  campo:      { display: 'flex', flexDirection: 'column', gap: 6 },
  label:      { fontSize: 15, fontWeight: '700', color: '#0f2a22' },
  errorTexto: { fontSize: 14, color: '#dc2626', fontWeight: '600', margin: 0 },
  boton:      { padding: '14px', fontSize: 16, backgroundColor: '#F97316', color: '#fff', border: 'none', borderRadius: 10, fontWeight: '800', cursor: 'pointer' },
  loginAviso: { textAlign: 'center', padding: '24px 16px' },
  loginTitulo:{ fontSize: 20, fontWeight: '800', color: '#0f2a22', margin: '0 0 8px' },
  loginDesc:  { fontSize: 15, color: '#4b7062', marginBottom: 20 },
  botonLogin: { display: 'inline-block', padding: '12px 24px', fontSize: 16, backgroundColor: '#F97316', color: '#fff', borderRadius: 10, fontWeight: '700', textDecoration: 'none' },
  exitoCaja:  { textAlign: 'center', padding: '24px 16px' },
  exitoTitulo:{ fontSize: 22, fontWeight: '800', color: '#085041', margin: '0 0 8px' },
  exitoDesc:  { fontSize: 16, color: '#4b7062', marginBottom: 20 },
  botonOtro:  { padding: '10px 20px', fontSize: 15, backgroundColor: 'transparent', color: '#F97316', border: '2px solid #F97316', borderRadius: 8, fontWeight: '700', cursor: 'pointer' },
};

export default FormularioSolicitud;
