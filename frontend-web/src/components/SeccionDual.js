import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaTag } from 'react-icons/fa';

const CATEGORIAS = [
  { nombre: 'Electricista',  icono: '⚡', desc: 'Instalaciones eléctricas' },
  { nombre: 'Gasfíter',      icono: '🔧', desc: 'Cañerías y grifos'        },
  { nombre: 'Carpintero',    icono: '🪚', desc: 'Muebles y puertas'         },
  { nombre: 'Pintor',        icono: '🎨', desc: 'Interior y exterior'       },
  { nombre: 'Albañil',       icono: '🧱', desc: 'Muros y construcción'      },
  { nombre: 'Cerrajero',     icono: '🔑', desc: 'Cerraduras y llaves'       },
];

const ICONOS_OFICIO = {
  'Electricista': '⚡', 'Gasfíter': '🔧', 'Carpintero': '🪚',
  'Pintor': '🎨', 'Albañil': '🧱', 'Cerrajero': '🔑',
  'Técnico en calefacción': '🔥', 'Jardinero': '🌿',
};

/* ---------- columna derecha: scroll automático ---------- */
function MaestrosScroll({ maestros }) {
  const [pausado, setPausado] = useState(false);
  const navigate = useNavigate();

  if (!maestros.length) return (
    <div style={s.scrollVacio}>
      <p style={{ fontSize: 17, color: '#4b7062', textAlign: 'center' }}>
        No hay maestros destacados aún.
      </p>
    </div>
  );

  // Duplicar la lista para que el loop sea continuo y sin salto
  const lista = [...maestros, ...maestros];
  const duracion = Math.max(maestros.length * 6, 12); // segundos

  return (
    <div
      style={s.scrollContenedor}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <div
        style={{
          ...s.scrollPista,
          animation: `scrollUp ${duracion}s linear infinite`,
          animationPlayState: pausado ? 'paused' : 'running',
        }}
      >
        {lista.map((m, i) => (
          <div key={`${m.id}-${i}`} style={s.card}>
            <div style={s.cardTop}>
              <div style={s.avatar}>{m.nombre?.[0]}</div>
              <div>
                <p style={s.cardNombre}>{m.nombre}</p>
                <p style={s.cardOficio}>
                  {ICONOS_OFICIO[m.oficio] || '🔧'} &nbsp;{m.oficio}
                </p>
                <p style={s.cardUbicacion}>
                  <FaMapMarkerAlt size={12} color="#1D9E75" /> &nbsp;{m.comuna}
                </p>
              </div>
            </div>

            <div style={s.cardMid}>
              <span style={s.estrellas}>
                {[1,2,3,4,5].map((n) => (
                  <FaStar key={n} size={14} color={n <= Math.round(m.calificacion || 0) ? '#EF9F27' : '#d1d5db'} />
                ))}
                <span style={s.calNum}>{m.calificacion > 0 ? m.calificacion.toFixed(1) : 'Nuevo'}</span>
              </span>
              <span style={s.precio}>${m.precioPorHora?.toLocaleString('es-CL')}/hr</span>
            </div>

            <button onClick={() => navigate(`/maestros/${m.id}`)} style={s.botonContactar}>
              Contactar ahora
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const PRODUCTOS = [
  { icono: '🔌', nombre: 'Cable eléctrico 2,5mm x 100m', marca: 'Policial', precio: 34990 },
  { icono: '🪛', nombre: 'Set destornilladores 12 pzas', marca: 'Stanley', precio: 18490 },
  { icono: '🎨', nombre: 'Pintura látex interior 4L', marca: 'Sipa', precio: 21990 },
  { icono: '🔧', nombre: 'Llave inglesa ajustable 12"', marca: 'Bahco', precio: 15990 },
];

/* ---------- columna de productos auspiciados ---------- */
function ProductosAuspiciados() {
  return (
    <div style={s.columnaProducts}>
      <div style={s.colTitulo}>
        <h2 style={s.tituloCol}>
          <FaTag size={16} color="#c0392b" style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Productos destacados
        </h2>
        <p style={s.subtituloCol}>Herramientas para el trabajo</p>
      </div>

      <div style={s.productosLista}>
        {PRODUCTOS.map((p) => (
          <div key={p.nombre} style={s.productoCard}>
            <span style={s.productoIcono}>{p.icono}</span>
            <div style={s.productoInfo}>
              <p style={s.productoNombre}>{p.nombre}</p>
              <p style={s.productoMarca}>{p.marca}</p>
              <p style={s.productoPrecio}>${p.precio.toLocaleString('es-CL')}</p>
            </div>
          </div>
        ))}
      </div>

      <a href="mailto:contacto@maestroschile.cl?subject=Quiero%20auspiciar" style={s.botonAuspiciar}>
        Publicite aquí →
      </a>
    </div>
  );
}

/* ---------- componente principal: tres columnas ---------- */
function SeccionDual({ maestros }) {
  const navigate = useNavigate();

  return (
    <section style={s.seccion}>
      <div style={s.inner}>

        {/* Columna izquierda — categorías */}
        <div style={s.columnaIzq}>
          <div style={s.colTitulo}>
            <h2 style={s.tituloCol}>Categorías de oficios</h2>
            <p style={s.subtituloCol}>Toque el oficio que necesita</p>
          </div>

          <div style={s.grilla}>
            {CATEGORIAS.map(({ nombre, icono, desc }) => (
              <button
                key={nombre}
                onClick={() => navigate(`/maestros?oficio=${encodeURIComponent(nombre)}`)}
                style={s.tarjetaCategoria}
              >
                <span style={s.categoriaIcono}>{icono}</span>
                <strong style={s.categoriaNombre}>{nombre}</strong>
                <span style={s.categoriaDesc}>{desc}</span>
              </button>
            ))}
          </div>

          <button onClick={() => navigate('/maestros')} style={s.botonVerTodos}>
            Ver todos los oficios →
          </button>
        </div>

        {/* Columna central — maestros destacados con scroll */}
        <div style={s.columnaDer}>
          <div style={s.colTitulo}>
            <h2 style={s.tituloCol}>
              <FaStar size={18} color="#EF9F27" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Maestros destacados
            </h2>
            <p style={s.subtituloCol}>Pasa el cursor para pausar</p>
          </div>

          <MaestrosScroll maestros={maestros} />
        </div>

        {/* Columna derecha — productos auspiciados */}
        <ProductosAuspiciados />

      </div>
    </section>
  );
}

const s = {
  seccion: { backgroundColor: '#ffffff', padding: '64px 24px', borderTop: '2px solid #b7e4ce' },
  inner: {
    maxWidth: 1200, margin: '0 auto',
    display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start',
  },

  /* columnas */
  columnaIzq:      { flex: '1 1 280px', minWidth: 0 },
  columnaDer:      { flex: '1 1 280px', minWidth: 0 },
  columnaProducts: { flex: '1 1 220px', minWidth: 0 },

  /* productos auspiciados */
  productosLista: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 },
  productoCard: {
    display: 'flex', alignItems: 'center', gap: 10,
    backgroundColor: '#fff5f5', border: '1.5px solid #f5c6c6',
    borderRadius: 12, padding: '10px 12px',
  },
  productoIcono:  { fontSize: 28, flexShrink: 0 },
  productoInfo:   { display: 'flex', flexDirection: 'column', gap: 2 },
  productoNombre: { fontSize: 13, fontWeight: '700', color: '#0f2a22', margin: 0, lineHeight: 1.3 },
  productoMarca:  { fontSize: 12, color: '#7a7a7a', margin: 0 },
  productoPrecio: { fontSize: 14, fontWeight: '800', color: '#c0392b', margin: 0 },
  botonAuspiciar: {
    display: 'block', textAlign: 'center', textDecoration: 'none',
    width: '100%', padding: '11px', backgroundColor: '#c0392b',
    color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: '700',
    boxSizing: 'border-box',
  },
  colTitulo:  { marginBottom: 20 },
  tituloCol:  { fontSize: 24, fontWeight: '800', color: '#0f2a22', margin: '0 0 6px' },
  subtituloCol: { fontSize: 16, color: '#4b7062', margin: 0 },

  /* grilla 2×3 */
  grilla: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 12, marginBottom: 20,
  },
  tarjetaCategoria: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 6, padding: '18px 10px',
    backgroundColor: '#f0fdf8', border: '2px solid #b7e4ce',
    borderRadius: 14, cursor: 'pointer',
  },
  categoriaIcono:  { fontSize: 36 },
  categoriaNombre: { fontSize: 16, fontWeight: '800', color: '#0f2a22', textAlign: 'center' },
  categoriaDesc:   { fontSize: 13, color: '#4b7062', textAlign: 'center', lineHeight: 1.3 },
  botonVerTodos: {
    width: '100%', padding: '13px', backgroundColor: '#1D9E75',
    color: '#fff', border: 'none', borderRadius: 10,
    fontSize: 16, fontWeight: '700', cursor: 'pointer',
  },

  /* scroll */
  scrollContenedor: {
    height: 400, overflow: 'hidden',
    border: '2px solid #EF9F27', borderRadius: 16,
    backgroundColor: '#fffdf5',
  },
  scrollVacio: {
    height: 400, display: 'flex', alignItems: 'center',
    justifyContent: 'center', border: '2px solid #b7e4ce',
    borderRadius: 16,
  },
  scrollPista: { display: 'flex', flexDirection: 'column', gap: 0 },

  /* card dentro del scroll */
  card: {
    padding: '16px 18px',
    borderBottom: '1px solid #f5e0b0',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  cardTop:     { display: 'flex', alignItems: 'center', gap: 12 },
  avatar: {
    width: 48, height: 48, borderRadius: '50%',
    backgroundColor: '#1D9E75', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, fontWeight: '800', flexShrink: 0,
  },
  cardNombre:   { fontSize: 16, fontWeight: '800', color: '#0f2a22', margin: '0 0 3px' },
  cardOficio:   { fontSize: 14, color: '#4b7062', margin: '0 0 2px' },
  cardUbicacion:{ display: 'flex', alignItems: 'center', fontSize: 13, color: '#4b7062', margin: 0 },
  cardMid:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  estrellas:   { display: 'inline-flex', alignItems: 'center', gap: 2 },
  calNum:      { marginLeft: 6, fontSize: 14, fontWeight: '700', color: '#4b7062' },
  precio:      { fontSize: 16, fontWeight: '800', color: '#1D9E75' },
  botonContactar: {
    backgroundColor: '#1D9E75', color: '#fff', border: 'none',
    borderRadius: 8, padding: '10px 14px',
    fontSize: 15, fontWeight: '700', cursor: 'pointer',
  },
};

export default SeccionDual;
