import { Link, useNavigate } from 'react-router-dom';
import { FaHardHat } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useResponsive } from '../hooks/useResponsive';

function Navbar() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const handleCerrarSesion = async () => {
    await cerrarSesion();
    navigate('/');
  };

  const btnBase = {
    borderRadius: 10, fontWeight: '700', cursor: 'pointer',
    textDecoration: 'none', display: 'inline-block',
    padding: isMobile ? '8px 14px' : '10px 22px',
    fontSize: isMobile ? 15 : 18,
  };

  return (
    <header style={s.header}>
      <div style={{ ...s.inner, padding: isMobile ? '12px 16px' : '14px 24px' }}>
        <Link to="/" style={s.logo}>
          <FaHardHat size={isMobile ? 22 : 28} color="#ffffff" />
          <span style={{ ...s.logoTexto, fontSize: isMobile ? 18 : 22 }}>
            Maestros Chile
          </span>
        </Link>

        <nav style={s.nav}>
          {usuario ? (
            <button onClick={handleCerrarSesion}
              style={{ ...btnBase, backgroundColor: 'transparent', border: '2px solid #fff', color: '#fff' }}>
              Salir
            </button>
          ) : (
            <>
              <Link to="/login"
                style={{ ...btnBase, backgroundColor: 'transparent', border: '2px solid #fff', color: '#fff' }}>
                Ingresar
              </Link>
              <Link to="/registro"
                style={{ ...btnBase, backgroundColor: '#fff', border: '2px solid #fff', color: '#1D9E75' }}>
                Soy maestro
              </Link>
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
    position: 'sticky', top: 0, zIndex: 100,
  },
  inner: {
    maxWidth: 1100, margin: '0 auto',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  logoTexto: { fontWeight: '800', color: '#ffffff', letterSpacing: 0.3 },
  nav: { display: 'flex', alignItems: 'center', gap: 8 },
};

export default Navbar;
