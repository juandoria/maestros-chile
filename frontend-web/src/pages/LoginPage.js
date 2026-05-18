import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { inputBase } from '../styles/theme';

const ERRORES = {
  'auth/invalid-credential': 'El correo o la contraseña no son correctos.\nRevise que los haya escrito bien e intente de nuevo.',
  'auth/user-not-found':     'No existe una cuenta con ese correo.',
  'auth/wrong-password':     'La contraseña no es correcta. Intente de nuevo.',
  'auth/too-many-requests':  'Demasiados intentos fallidos. Espere unos minutos e intente de nuevo.',
};

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(ERRORES[err.code] || 'Ocurrió un error. Intente de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={s.pagina}>
      <div style={s.caja}>
        <h2 style={s.titulo}>Iniciar sesión</h2>

        <form onSubmit={handleLogin} style={s.formulario}>
          <div>
            <label style={s.label}>Su correo electrónico</label>
            <input
              type="email" placeholder="ejemplo@correo.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required style={inputBase}
            />
          </div>
          <div>
            <label style={s.label}>Su contraseña</label>
            <input
              type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required style={inputBase}
            />
          </div>

          {error && (
            <div style={s.errorCaja}>
              <span style={{ fontSize: 22 }}>⚠️</span>
              <p style={s.errorTexto}>{error}</p>
            </div>
          )}

          <button type="submit" disabled={cargando} style={s.boton}>
            {cargando ? 'Ingresando...' : '✓  Ingresar'}
          </button>
        </form>

        <hr style={s.hr} />
        <p style={s.linkTexto}>¿No tiene cuenta todavía?</p>
        <Link to="/registro" style={s.botonSecundario}>Crear cuenta nueva</Link>
      </div>
    </div>
  );
}

const s = {
  pagina: {
    backgroundColor: '#E1F5EE', minHeight: 'calc(100vh - 140px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  caja: {
    backgroundColor: '#ffffff', border: '2px solid #b7e4ce',
    borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 440,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  titulo: { fontSize: 30, fontWeight: '800', color: '#0f2a22', textAlign: 'center', marginBottom: 28 },
  formulario: { display: 'flex', flexDirection: 'column', gap: 20 },
  label: { display: 'block', fontSize: 18, fontWeight: '700', color: '#0f2a22', marginBottom: 8 },
  errorCaja: {
    display: 'flex', gap: 12, alignItems: 'flex-start',
    backgroundColor: '#fef2f2', border: '2px solid #fca5a5',
    borderRadius: 10, padding: '14px 16px',
  },
  errorTexto: { fontSize: 17, color: '#dc2626', margin: 0, lineHeight: 1.5, whiteSpace: 'pre-line' },
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

export default LoginPage;
