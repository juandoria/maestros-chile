import { useState } from 'react';
import FormularioConsulta from './FormularioConsulta';
import FormularioSolicitud from './FormularioSolicitud';
import ChatMaestro from './ChatMaestro';

const TABS = [
  { key: 'chat',      icono: '💬', label: 'Chat en vivo',    desc: 'Para urgencias' },
  { key: 'solicitud', icono: '📋', label: 'Cotización',      desc: 'Solicitar presupuesto' },
  { key: 'consulta',  icono: '✉️', label: 'Consulta rápida', desc: 'Hacer una pregunta' },
];

function ContactoMaestro({ maestroId, maestroNombre, oficios }) {
  const [tabActivo, setTabActivo] = useState('chat');

  return (
    <div style={s.contenedor}>
      {/* Tabs */}
      <div style={s.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTabActivo(t.key)}
            style={{
              ...s.tab,
              backgroundColor: tabActivo === t.key ? '#fff' : 'transparent',
              borderBottom:    tabActivo === t.key ? '3px solid #1D9E75' : '3px solid transparent',
              color:           tabActivo === t.key ? '#0f2a22' : '#6b7280',
            }}
          >
            <span style={{ fontSize: 20 }}>{t.icono}</span>
            <span style={s.tabLabel}>{t.label}</span>
            <span style={s.tabDesc}>{t.desc}</span>
          </button>
        ))}
      </div>

      {/* Contenido del tab activo */}
      <div style={s.cuerpo}>
        {tabActivo === 'chat' && (
          <ChatMaestro maestroId={maestroId} maestroNombre={maestroNombre} />
        )}
        {tabActivo === 'solicitud' && (
          <FormularioSolicitud maestroId={maestroId} maestroNombre={maestroNombre} oficios={oficios} />
        )}
        {tabActivo === 'consulta' && (
          <FormularioConsulta maestroId={maestroId} maestroNombre={maestroNombre} />
        )}
      </div>
    </div>
  );
}

const s = {
  contenedor: {
    border: '2px solid #b7e4ce', borderRadius: 16,
    overflow: 'hidden', backgroundColor: '#fff',
    marginBottom: 16,
  },
  tabs: {
    display: 'flex',
    borderBottom: '1.5px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  tab: {
    flex: 1, padding: '12px 8px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    border: 'none', cursor: 'pointer', transition: 'background 0.15s',
  },
  tabLabel: { fontSize: 13, fontWeight: '700' },
  tabDesc:  { fontSize: 11, color: '#9ca3af' },
  cuerpo:   { padding: '18px 20px' },
};

export default ContactoMaestro;
