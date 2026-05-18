import { Link, useNavigate } from 'react-router-dom';
import { FaHardHat } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const handleCerrarSesion = async () => {
    await cerrarSesion();
    navigate('/');
  };

  return (
    <header style={s.header}>
      <div style={s.inner}>
        <Link to="/" style={s.logo}>
          <FaHardHat size={28} color="#ffffff" />
          <span style={s.logoTexto}>Maestros Chile</span>
        </Link>

        <nav style={s.nav}>
          {usuario ? (
            <button onClick={handleCerrarSesion} style={s.botonSecundario}>
              Salir
            </button>
          ) : (
            <>
              <Link to="/login" style={s.botonSecundario}>Ingresar</Link>
              <Link to="/registro" style={s.botonPrimario}>Soy maestro</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

const s = {
  header: {
    backgroundColor: '#1D9E75',
    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '14px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    textDecoration: 'none',
  },
  logoTexto: {
    fontSize: 22, fontWeight: '800', color: '#ffffff', letterSpacing: 0.3,
  },
  nav: { display: 'flex', alignItems: 'center', gap: 12 },
  botonSecundario: {
    padding: '10px 22px',
    backgroundColor: 'transparent',
    border: '2px solid #ffffff',
    borderRadius: 10,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  botonPrimario: {
    padding: '10px 22px',
    backgroundColor: '#ffffff',
    border: '2px solid #ffffff',
    borderRadius: 10,
    color: '#1D9E75',
    fontSize: 18,
    fontWeight: '700',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
};

export default Navbar;
