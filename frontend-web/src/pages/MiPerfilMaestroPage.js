import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../services/firebase';
import { getMiPerfilMaestro, createMaestro, updateMaestro } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { inputBase } from '../styles/theme';
import HorarioSemanal, { HORARIO_DEFAULT } from '../components/HorarioSemanal';

const OFICIOS = [
  'Electricista', 'Gasfíter', 'Carpintero', 'Pintor',
  'Albañil', 'Cerrajero', 'Técnico en calefacción', 'Jardinero',
];

const ESPECIALIDADES_SUGERIDAS = {
  'Electricista':           ['Instalaciones nuevas', 'Reparaciones', 'Tableros eléctricos', 'Iluminación LED'],
  'Gasfíter':               ['Cañerías', 'Calefont', 'Calefacción', 'Desatascados'],
  'Carpintero':             ['Muebles a medida', 'Puertas', 'Pisos de madera', 'Reparaciones'],
  'Pintor':                 ['Interior', 'Exterior', 'Barniz', 'Estuco'],
  'Albañil':                ['Muros', 'Cielos', 'Cerámicas', 'Revestimientos'],
  'Cerrajero':              ['Cambio de chapa', 'Apertura de emergencia', 'Duplicado de llaves'],
  'Técnico en calefacción': ['Radiadores', 'Calderas', 'Mantenimiento', 'Instalación'],
  'Jardinero':              ['Poda', 'Riego automático', 'Diseño de jardines', 'Corte de pasto'],
};

function MiPerfilMaestroPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const inputFoto = useRef(null);

  const [perfilId, setPerfilId]         = useState(null);
  const [form, setForm]                 = useState({
    nombre: '', comuna: '', descripcion: '', precioPorHora: '', disponible: true,
  });
  const [oficios, setOficios]           = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [horario, setHorario]           = useState(HORARIO_DEFAULT);
  const [fotoUrl, setFotoUrl]           = useState('');
  const [fotoPreview, setFotoPreview]   = useState('');
  const [fotoFile, setFotoFile]         = useState(null);
  const [cargando, setCargando]         = useState(true);
  const [guardando, setGuardando]       = useState(false);
  const [exito, setExito]               = useState('');
  const [error, setError]               = useState('');

  useEffect(() => {
    if (!usuario) { navigate('/login'); return; }
    getMiPerfilMaestro()
      .then((res) => {
        const d = res.data;
        setPerfilId(d.id);
        setForm({
          nombre:        d.nombre        || '',
          comuna:        d.comuna        || '',
          descripcion:   d.descripcion   || '',
          precioPorHora: d.precioPorHora || '',
          disponible:    d.disponible    ?? true,
        });
        setOficios(d.oficios || (d.oficio ? [d.oficio] : []));
        setEspecialidades(d.especialidades || []);
        setHorario(d.horario || HORARIO_DEFAULT);
        setFotoUrl(d.fotoUrl || '');
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [usuario, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const toggleOficio = (oficio) => {
    setOficios((prev) =>
      prev.includes(oficio) ? prev.filter((o) => o !== oficio) : [...prev, oficio]
    );
  };

  const toggleEspecialidad = (esp) => {
    setEspecialidades((prev) =>
      prev.includes(esp) ? prev.filter((e) => e !== esp) : [...prev, esp]
    );
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const subirFoto = async () => {
    if (!fotoFile) return fotoUrl;
    const uid = auth.currentUser.uid;
    const storageRef = ref(storage, `maestros/${uid}/foto`);
    await uploadBytes(storageRef, fotoFile);
    return getDownloadURL(storageRef);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError(''); setExito('');
    if (oficios.length === 0 || !form.comuna || !form.precioPorHora) {
      setError('Selecciona al menos un oficio, tu comuna y precio por hora.');
      return;
    }
    setGuardando(true);
    try {
      const urlFoto = await subirFoto();
      const datos = {
        ...form,
        precioPorHora: Number(form.precioPorHora),
        oficios,
        especialidades,
        horario,
        fotoUrl: urlFoto,
      };
      if (perfilId) {
        await updateMaestro(perfilId, datos);
      } else {
        const res = await createMaestro(datos);
        setPerfilId(res.data.id);
      }
      setFotoUrl(urlFoto);
      setFotoFile(null);
      setExito('¡Perfil guardado correctamente!');
      setTimeout(() => setExito(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar. Intente de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <div style={s.centrado}><p style={s.cargando}>Cargando tu perfil...</p></div>;

  const sugerencias = [...new Set(oficios.flatMap((o) => ESPECIALIDADES_SUGERIDAS[o] || []))];
  const fotoMostrar = fotoPreview || fotoUrl;

  return (
    <div style={s.pagina}>
      <h1 style={s.titulo}>{perfilId ? 'Editar mi perfil' : 'Crear perfil de maestro'}</h1>
      <p style={s.subtitulo}>
        {perfilId
          ? 'Actualiza tu información para que los clientes te encuentren.'
          : 'Completa tu perfil para aparecer en las búsquedas.'}
      </p>

      <form onSubmit={handleGuardar} style={s.form}>

        {/* Foto de perfil */}
        <div style={s.campo}>
          <label style={s.label}>Foto de perfil</label>
          <div style={s.fotoArea}>
            {fotoMostrar ? (
              <img src={fotoMostrar} alt="Foto de perfil" style={s.fotoImg} />
            ) : (
              <div style={s.fotoPlaceholder}>
                <span style={{ fontSize: 40 }}>👤</span>
                <span style={{ fontSize: 13, color: '#9ca3af', marginTop: 6 }}>Sin foto</span>
              </div>
            )}
            <div style={s.fotoBotones}>
              <button type="button" onClick={() => inputFoto.current.click()} style={s.botonFoto}>
                {fotoMostrar ? 'Cambiar foto' : 'Subir foto'}
              </button>
              {fotoMostrar && (
                <button type="button" onClick={() => { setFotoFile(null); setFotoPreview(''); setFotoUrl(''); }} style={s.botonFotoEliminar}>
                  Quitar foto
                </button>
              )}
              <input
                ref={inputFoto}
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                style={{ display: 'none' }}
              />
              <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
                JPG o PNG, máximo 5 MB
              </p>
            </div>
          </div>
        </div>

        {/* Nombre */}
        <div style={s.campo}>
          <label style={s.label}>Tu nombre completo</label>
          <input name="nombre" value={form.nombre} onChange={handleChange}
            placeholder="Ej: Carlos Muñoz" style={inputBase} />
        </div>

        {/* Oficios — múltiple selección */}
        <div style={s.campo}>
          <label style={s.label}>¿En qué oficios trabajas? * <span style={s.labelHint}>(puedes elegir varios)</span></label>
          <div style={s.chips}>
            {OFICIOS.map((o) => (
              <button
                key={o} type="button"
                onClick={() => toggleOficio(o)}
                style={{
                  ...s.chip,
                  backgroundColor: oficios.includes(o) ? '#1D9E75' : '#f0fdf8',
                  color:           oficios.includes(o) ? '#fff'     : '#085041',
                  border:          oficios.includes(o) ? '2px solid #1D9E75' : '2px solid #b7e4ce',
                }}
              >
                {oficios.includes(o) ? '✓ ' : ''}{o}
              </button>
            ))}
          </div>
        </div>

        {/* Especialidades (basadas en oficios seleccionados) */}
        {sugerencias.length > 0 && (
          <div style={s.campo}>
            <label style={s.label}>Especialidades</label>
            <div style={s.chips}>
              {sugerencias.map((esp) => (
                <button
                  key={esp} type="button"
                  onClick={() => toggleEspecialidad(esp)}
                  style={{
                    ...s.chip,
                    backgroundColor: especialidades.includes(esp) ? '#F97316' : '#f0fdf8',
                    color:           especialidades.includes(esp) ? '#fff'     : '#085041',
                    border:          especialidades.includes(esp) ? '2px solid #F97316' : '2px solid #b7e4ce',
                  }}
                >
                  {especialidades.includes(esp) ? '✓ ' : ''}{esp}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comuna */}
        <div style={s.campo}>
          <label style={s.label}>Tu comuna *</label>
          <input name="comuna" value={form.comuna} onChange={handleChange}
            placeholder="Ej: Peñalolén" style={inputBase} />
        </div>

        {/* Precio */}
        <div style={s.campo}>
          <label style={s.label}>Precio por hora (CLP) *</label>
          <input name="precioPorHora" type="number" value={form.precioPorHora}
            onChange={handleChange} placeholder="Ej: 15000" style={inputBase} />
        </div>

        {/* Descripción */}
        <div style={s.campo}>
          <label style={s.label}>Descripción de tu servicio</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
            placeholder="Cuéntales a los clientes sobre tu experiencia y forma de trabajo..."
            rows={4} style={{ ...inputBase, resize: 'vertical', minHeight: 100 }} />
        </div>

        {/* Horario semanal */}
        <div style={s.campo}>
          <label style={s.label}>Disponibilidad semanal</label>
          <p style={s.labelHint2}>Indica los días y horarios en que puedes recibir trabajos</p>
          <HorarioSemanal horario={horario} onChange={setHorario} />
        </div>

        {/* Disponible ahora */}
        <div style={s.disponibleFila}>
          <label style={s.label}>¿Disponible para trabajos ahora?</label>
          <div
            onClick={() => setForm({ ...form, disponible: !form.disponible })}
            style={{ ...s.toggle, backgroundColor: form.disponible ? '#1D9E75' : '#d1d5db' }}
          >
            <div style={{
              ...s.toggleCirculo,
              transform: form.disponible ? 'translateX(24px)' : 'translateX(2px)',
            }} />
          </div>
          <span style={{ fontSize: 16, color: form.disponible ? '#085041' : '#9ca3af', fontWeight: '700' }}>
            {form.disponible ? 'Sí, estoy disponible' : 'No disponible ahora'}
          </span>
        </div>

        {error && <p style={s.errorTexto}>⚠️ {error}</p>}
        {exito && <p style={s.exitoTexto}>✓ {exito}</p>}

        <button type="submit" disabled={guardando} style={s.boton}>
          {guardando ? 'Guardando...' : perfilId ? '✓  Guardar cambios' : '✓  Crear mi perfil'}
        </button>

        {perfilId && (
          <button type="button" onClick={() => navigate(`/maestros/${perfilId}`)} style={s.botonSecundario}>
            Ver mi perfil público →
          </button>
        )}
      </form>
    </div>
  );
}

const s = {
  pagina:     { maxWidth: 600, margin: '0 auto', padding: '32px 24px 80px', minHeight: 'calc(100vh - 140px)' },
  centrado:   { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
  cargando:   { fontSize: 20, color: '#4b7062' },
  titulo:     { fontSize: 28, fontWeight: '900', color: '#0f2a22', margin: '0 0 8px' },
  subtitulo:  { fontSize: 17, color: '#4b7062', marginBottom: 32 },
  form:       { display: 'flex', flexDirection: 'column', gap: 24 },
  campo:      { display: 'flex', flexDirection: 'column', gap: 8 },
  label:      { fontSize: 17, fontWeight: '700', color: '#0f2a22' },
  labelHint:  { fontSize: 14, fontWeight: '500', color: '#6b7280' },
  labelHint2: { fontSize: 14, color: '#6b7280', margin: '0 0 4px' },

  fotoArea:      { display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' },
  fotoImg:       { width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid #b7e4ce' },
  fotoPlaceholder: {
    width: 100, height: 100, borderRadius: '50%',
    border: '3px dashed #b7e4ce', backgroundColor: '#f0fdf8',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  },
  fotoBotones:   { display: 'flex', flexDirection: 'column', gap: 8 },
  botonFoto:     {
    padding: '8px 18px', fontSize: 14, fontWeight: '700',
    backgroundColor: '#f0fdf8', color: '#085041',
    border: '2px solid #1D9E75', borderRadius: 8, cursor: 'pointer',
  },
  botonFotoEliminar: {
    padding: '8px 18px', fontSize: 14, fontWeight: '700',
    backgroundColor: '#fff', color: '#dc2626',
    border: '2px solid #fca5a5', borderRadius: 8, cursor: 'pointer',
  },

  chips: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  chip:  { padding: '8px 16px', borderRadius: 20, fontSize: 15, fontWeight: '600', cursor: 'pointer' },

  disponibleFila: { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' },
  toggle:         { width: 52, height: 28, borderRadius: 14, cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 },
  toggleCirculo:  { position: 'absolute', top: 3, width: 22, height: 22, borderRadius: '50%', backgroundColor: '#fff', transition: 'transform 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' },

  errorTexto:     { fontSize: 16, color: '#dc2626', fontWeight: '600', margin: 0 },
  exitoTexto:     { fontSize: 16, color: '#085041', fontWeight: '700', backgroundColor: '#E1F5EE', padding: '12px 16px', borderRadius: 10, margin: 0 },
  boton:          { padding: '16px', fontSize: 18, backgroundColor: '#F97316', color: '#fff', border: 'none', borderRadius: 10, fontWeight: '800', cursor: 'pointer' },
  botonSecundario:{ padding: '14px', fontSize: 16, backgroundColor: 'transparent', color: '#1D9E75', border: '2px solid #1D9E75', borderRadius: 10, fontWeight: '700', cursor: 'pointer' },
};

export default MiPerfilMaestroPage;
