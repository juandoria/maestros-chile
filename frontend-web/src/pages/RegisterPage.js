import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { createPerfil } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { inputBase } from '../styles/theme';

const ERRORES = {
  'auth/email-already-in-use': 'Ese correo ya tiene una cuenta registrada. ¿Quiere iniciar sesión?',
  'auth/weak-password':        'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-email':        'El correo no es válido. Revise que lo haya escrito bien.',
};

const CAMPOS = [
  { name: 'nombre',   label: 'Su nombre completo',     placeholder: 'Juan González',      type: 'text'     },
  { name: 'email',    label: 'Su correo electrónico',  placeholder: 'ejemplo@correo.com', type: 'email'    },
  { name: 'password', label: 'Elija una contraseña',   placeholder: 'Mínimo 6 caracteres',type: 'password' },
  { name: 'telefono', label: 'Su número de teléfono',  placeholder: '+56 9 1234 5678',    type: 'tel'      },
  { name: 'comuna',   label: 'La comuna donde vive',   placeholder: 'Ej: Peñalolén',      type: 'text'     },
];

function RegisterPage() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', telefono: '', comuna: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      await createPerfil({ nombre: form.nombre, telefono: form.telefono, comuna: form.comuna });
      navigate('/');
    } catch (err) {
      setError(ERRORES[err.code] || 'Ocurrió un error al crear la cuenta. Intente de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={s.pagina}>
      <div style={s.caja}>
        <h2 style={s.titulo}>Crear cuenta</h2>
        <p style={s.subtitulo}>Complete los datos para registrarse</p>

        <form onSubmit={handleRegistro} style={s.formulario}>
          {CAMPOS.map(({ name, label, placeholder, type }) => (
            <div key={name}>
              <label style={s.label}>{label}</label>
              <input
                name={name} type={type} placeholder={placeholder}
                value={form[name]} onChange={handleChange}
                required style={inputBase}
              />
            </div>
          ))}

          {error && (
            <div style={s.errorCaja}>
              <span style={{ fontSize: 22 }}>⚠️</span>
              <p style={s.errorTexto}>{error}</p>
            </div>
          )}

          <button type="submit" disabled={cargando} style={s.boton}>
            {cargando ? 'Creando cuenta...' : '✓  Registrarse'}
          </button>
        </form>

        <hr style={s.hr} />
        <p style={s.linkTexto}>¿Ya tiene una cuenta?</p>
        <Link to="/login" style={s.botonSecundario}>Iniciar sesión</Link>
      </div>
    </div>
  );
}

const s = {
  pagina: {
    backgroundColor: '#E1F5EE', minHeight: 'calc(100vh - 140px)',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    padding: '40px 24px 80px',
  },
  caja: {
    backgroundColor: '#ffffff', border: '2px solid #b7e4ce',
    borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 440,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  titulo: { fontSize: 30, fontWeight: '800', color: '#0f2a22', textAlign: 'center', margin: '0 0 6px' },
  subtitulo: { fontSize: 18, color: '#4b7062', textAlign: 'center', marginBottom: 28 },
  formulario: { display: 'flex', flexDirection: 'column', gap: 20 },
  label: { display: 'block', fontSize: 18, fontWeight: '700', color: '#0f2a22', marginBottom: 8 },
  errorCaja: {
    display: 'flex', gap: 12, alignItems: 'flex-start',
    backgroundColor: '#fef2f2', border: '2px solid #fca5a5',
    borderRadius: 10, padding: '14px 16px',
  },
  errorTexto: { fontSize: 17, color: '#dc2626', margin: 0, lineHeight: 1.5 },
  boton: {
    padding: '16px', fontSize: 19, backgroundColor: '#1D9E75',
    color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: '800',
  },
  hr: { border: 'none', borderTop: '1px solid #b7e4ce', margin: '28px 0' },
  linkTexto: { textAlign: 'center', fontSize: 18, color: '#4b7062', marginBottom: 12 },
  botonSecundario: {
    display: 'block', textAlign: 'center', textDecoration: 'none',
    border: '2px solid #1D9E75', color: '#1D9E75', borderRadius: 10,
    padding: '14px', fontSize: 18, fontWeight: '700',
  },
};

export default RegisterPage;
