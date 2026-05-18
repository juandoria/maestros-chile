import { Link } from 'react-router-dom';
import { FaHardHat } from 'react-icons/fa';

function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.contenido}>
        <div style={s.logo}>
          <FaHardHat size={24} color="#E1F5EE" />
          <span style={s.logoTexto}>Maestros Chile</span>
        </div>
        <Link to="/registro-maestro" style={s.link}>
          ¿Eres maestro? Destaca tu servicio →
        </Link>
      </div>
      <p style={s.copyright}>© 2025 Maestros Chile — Conectando personas con buenos maestros</p>
    </footer>
  );
}

const s = {
  footer: {
    backgroundColor: '#085041',
    padding: '40px 24px 28px',
  },
  contenido: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 24,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoTexto: { fontSize: 20, fontWeight: '800', color: '#E1F5EE' },
  link: {
    color: '#EF9F27',
    textDecoration: 'none',
    fontSize: 18,
    fontWeight: '700',
    borderBottom: '2px solid #EF9F27',
    paddingBottom: 2,
  },
  copyright: {
    textAlign: 'center',
    color: '#7bbfac',
    fontSize: 15,
    margin: 0,
  },
};

export default Footer;
