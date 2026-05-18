const PASOS = [
  { num: 1, titulo: 'Busca el oficio',        desc: 'Escribe lo que necesitas en el buscador o elige una categoría.', icono: '🔍' },
  { num: 2, titulo: 'Elige un maestro',       desc: 'Revisa los perfiles, calificaciones y precios, y elige el mejor.', icono: '👷' },
  { num: 3, titulo: 'Contáctalo por WhatsApp', desc: 'Escríbele directo. Sin intermediarios, sin demoras.', icono: '📱' },
];

function ComoFunciona() {
  return (
    <section style={s.seccion}>
      <div style={s.inner}>
        <h2 style={s.titulo}>¿Cómo funciona?</h2>
        <p style={s.subtitulo}>En 3 simples pasos tienes a tu maestro</p>

        <div style={s.pasos}>
          {PASOS.map(({ num, titulo, desc, icono }) => (
            <div key={num} style={s.paso}>
              <div style={s.circulo}>
                <span style={s.numero}>{num}</span>
              </div>
              <div style={s.icono}>{icono}</div>
              <h3 style={s.pasoTitulo}>{titulo}</h3>
              <p style={s.pasoDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const s = {
  seccion: { backgroundColor: '#E1F5EE', padding: '64px 24px' },
  inner: { maxWidth: 900, margin: '0 auto', textAlign: 'center' },
  titulo: { fontSize: 32, fontWeight: '800', color: '#0f2a22', margin: '0 0 10px' },
  subtitulo: { fontSize: 19, color: '#4b7062', marginBottom: 48 },
  pasos: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 32,
  },
  paso: {
    backgroundColor: '#ffffff', borderRadius: 16,
    padding: '32px 24px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  circulo: {
    width: 52, height: 52, borderRadius: '50%',
    backgroundColor: '#1D9E75',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  numero: { color: '#ffffff', fontSize: 24, fontWeight: '900' },
  icono: { fontSize: 40, marginBottom: 14 },
  pasoTitulo: { fontSize: 20, fontWeight: '800', color: '#0f2a22', margin: '0 0 10px' },
  pasoDesc: { fontSize: 17, color: '#4b7062', lineHeight: 1.6, margin: 0 },
};

export default ComoFunciona;
