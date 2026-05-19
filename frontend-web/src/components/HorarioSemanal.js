const DIAS = [
  { key: 'lunes',     label: 'Lunes'     },
  { key: 'martes',    label: 'Martes'    },
  { key: 'miercoles', label: 'Miércoles' },
  { key: 'jueves',    label: 'Jueves'    },
  { key: 'viernes',   label: 'Viernes'   },
  { key: 'sabado',    label: 'Sábado'    },
  { key: 'domingo',   label: 'Domingo'   },
];

export const HORARIO_DEFAULT = {
  lunes:     { activo: true,  desde: '08:00', hasta: '18:00' },
  martes:    { activo: true,  desde: '08:00', hasta: '18:00' },
  miercoles: { activo: true,  desde: '08:00', hasta: '18:00' },
  jueves:    { activo: true,  desde: '08:00', hasta: '18:00' },
  viernes:   { activo: true,  desde: '08:00', hasta: '18:00' },
  sabado:    { activo: false, desde: '09:00', hasta: '14:00' },
  domingo:   { activo: false, desde: '09:00', hasta: '14:00' },
};

function HorarioSemanal({ horario, onChange }) {

  const toggleDia = (key) => {
    onChange({ ...horario, [key]: { ...horario[key], activo: !horario[key].activo } });
  };

  const cambiarHora = (key, campo, valor) => {
    onChange({ ...horario, [key]: { ...horario[key], [campo]: valor } });
  };

  return (
    <div style={s.contenedor}>
      {DIAS.map(({ key, label }) => {
        const dia = horario[key];
        return (
          <div key={key} style={{
            ...s.fila,
            backgroundColor: dia.activo ? '#f0fdf8' : '#f9fafb',
            borderColor: dia.activo ? '#b7e4ce' : '#e5e7eb',
          }}>
            {/* Toggle día activo */}
            <div
              onClick={() => toggleDia(key)}
              style={{
                ...s.toggle,
                backgroundColor: dia.activo ? '#1D9E75' : '#d1d5db',
              }}
            >
              <div style={{
                ...s.toggleCirculo,
                transform: dia.activo ? 'translateX(22px)' : 'translateX(2px)',
              }} />
            </div>

            {/* Nombre del día */}
            <span style={{
              ...s.labelDia,
              color: dia.activo ? '#0f2a22' : '#9ca3af',
              fontWeight: dia.activo ? '700' : '500',
            }}>
              {label}
            </span>

            {/* Horario */}
            {dia.activo ? (
              <div style={s.horas}>
                <input
                  type="time"
                  value={dia.desde}
                  onChange={(e) => cambiarHora(key, 'desde', e.target.value)}
                  style={s.inputHora}
                />
                <span style={s.separador}>→</span>
                <input
                  type="time"
                  value={dia.hasta}
                  onChange={(e) => cambiarHora(key, 'hasta', e.target.value)}
                  style={s.inputHora}
                />
              </div>
            ) : (
              <span style={s.noDisponible}>No disponible</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

const s = {
  contenedor: { display: 'flex', flexDirection: 'column', gap: 8 },
  fila: {
    display: 'flex', alignItems: 'center', gap: 12,
    border: '2px solid', borderRadius: 12,
    padding: '10px 14px', flexWrap: 'wrap',
  },
  toggle: {
    width: 46, height: 26, borderRadius: 13,
    cursor: 'pointer', position: 'relative',
    transition: 'background 0.2s', flexShrink: 0,
  },
  toggleCirculo: {
    position: 'absolute', top: 3,
    width: 20, height: 20, borderRadius: '50%',
    backgroundColor: '#fff', transition: 'transform 0.2s',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
  },
  labelDia: { fontSize: 15, width: 80, flexShrink: 0 },
  horas: { display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' },
  inputHora: {
    padding: '6px 10px', fontSize: 15,
    border: '2px solid #b7e4ce', borderRadius: 8,
    color: '#0f2a22', fontFamily: 'inherit', outline: 'none',
    backgroundColor: '#fff',
  },
  separador: { fontSize: 14, color: '#4b7062', fontWeight: '700' },
  noDisponible: { fontSize: 14, color: '#9ca3af', marginLeft: 'auto' },
};

export default HorarioSemanal;
