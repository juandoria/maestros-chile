import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection, query, where, orderBy, onSnapshot, doc, updateDoc,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { getMiPerfilMaestro } from '../services/api';
import ChatPanelMaestro from '../components/ChatPanelMaestro';

const TABS = ['solicitudes', 'consultas', 'chats'];
const TAB_LABELS = { solicitudes: '📋 Solicitudes', consultas: '✉️ Consultas', chats: '💬 Chats' };
const ESTADO_ESTILOS = {
  pendiente:  { backgroundColor: '#fef3c7', color: '#92400e', border: '1.5px solid #fcd34d' },
  aceptada:   { backgroundColor: '#E1F5EE', color: '#085041', border: '1.5px solid #1D9E75' },
  rechazada:  { backgroundColor: '#fef2f2', color: '#dc2626', border: '1.5px solid #fca5a5' },
};

function PanelMaestroPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [maestroId, setMaestroId]     = useState(null);
  const [tabActivo, setTabActivo]     = useState('solicitudes');
  const [solicitudes, setSolicitudes] = useState([]);
  const [consultas, setConsultas]     = useState([]);
  const [chats, setChats]             = useState([]);
  const [chatAbierto, setChatAbierto] = useState(null);
  const [cargando, setCargando]       = useState(true);

  useEffect(() => {
    if (!usuario) { navigate('/login'); return; }
    getMiPerfilMaestro()
      .then((res) => setMaestroId(res.data.id))
      .catch(() => navigate('/mi-perfil-maestro'))
      .finally(() => setCargando(false));
  }, [usuario, navigate]);

  // Suscripciones en tiempo real cuando ya tenemos el maestroId
  useEffect(() => {
    if (!maestroId) return;

    const qSol = query(
      collection(db, 'solicitudes'),
      where('maestroId', '==', maestroId),
      orderBy('creadoEn', 'desc')
    );
    const qCon = query(
      collection(db, 'consultas'),
      where('maestroId', '==', maestroId),
      orderBy('creadoEn', 'desc')
    );
    const qChat = query(
      collection(db, 'chats'),
      where('maestroId', '==', maestroId),
      orderBy('ultimaActividad', 'desc')
    );

    const u1 = onSnapshot(qSol,  (s) => setSolicitudes(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const u2 = onSnapshot(qCon,  (s) => setConsultas(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const u3 = onSnapshot(qChat, (s) => setChats(s.docs.map((d) => ({ id: d.id, ...d.data() }))));

    return () => { u1(); u2(); u3(); };
  }, [maestroId]);

  const cambiarEstadoSolicitud = async (id, nuevoEstado) => {
    await updateDoc(doc(db, 'solicitudes', id), { estado: nuevoEstado });
  };

  if (cargando) return <div style={s.centrado}><p style={s.cargandoTexto}>Cargando tu panel...</p></div>;

  if (chatAbierto) {
    return (
      <div style={s.pagina}>
        <button onClick={() => setChatAbierto(null)} style={s.botonVolver}>← Volver al panel</button>
        <p style={s.chatConLabel}>Chat con <strong>{chatAbierto.clienteNombre}</strong></p>
        <ChatPanelMaestro chatId={chatAbierto.id} maestroId={maestroId} />
      </div>
    );
  }

  return (
    <div style={s.pagina}>
      <h1 style={s.titulo}>Mi panel</h1>
      <p style={s.subtitulo}>Revisa las solicitudes y mensajes de tus clientes</p>

      {/* Tabs */}
      <div style={s.tabs}>
        {TABS.map((t) => {
          const conteo = t === 'solicitudes' ? solicitudes.filter(s => s.estado === 'pendiente').length
                       : t === 'consultas'   ? consultas.filter(c => !c.respondido).length
                       : chats.length;
          return (
            <button key={t} onClick={() => setTabActivo(t)} style={{
              ...s.tab,
              borderBottom: tabActivo === t ? '3px solid #1D9E75' : '3px solid transparent',
              color:        tabActivo === t ? '#0f2a22' : '#6b7280',
              fontWeight:   tabActivo === t ? '800' : '600',
            }}>
              {TAB_LABELS[t]}
              {conteo > 0 && <span style={s.badge}>{conteo}</span>}
            </button>
          );
        })}
      </div>

      {/* Solicitudes */}
      {tabActivo === 'solicitudes' && (
        <div style={s.lista}>
          {solicitudes.length === 0 ? (
            <p style={s.vacio}>No tienes solicitudes de cotización aún.</p>
          ) : solicitudes.map((sol) => (
            <div key={sol.id} style={s.card}>
              <div style={s.cardEncabezado}>
                <div>
                  <p style={s.cardNombre}>{sol.clienteNombre}</p>
                  <p style={s.cardMeta}>{sol.oficio} · {sol.telefono}</p>
                  {sol.fechaTentativa && <p style={s.cardMeta}>📅 {sol.fechaTentativa}</p>}
                  {sol.direccion && <p style={s.cardMeta}>📍 {sol.direccion}</p>}
                </div>
                <span style={{ ...s.estadoBadge, ...ESTADO_ESTILOS[sol.estado] }}>
                  {sol.estado}
                </span>
              </div>
              <p style={s.cardDesc}>{sol.descripcion}</p>
              {sol.estado === 'pendiente' && (
                <div style={s.acciones}>
                  <button onClick={() => cambiarEstadoSolicitud(sol.id, 'aceptada')} style={s.botonAceptar}>
                    ✓ Aceptar
                  </button>
                  <button onClick={() => cambiarEstadoSolicitud(sol.id, 'rechazada')} style={s.botonRechazar}>
                    ✗ Rechazar
                  </button>
                </div>
              )}
              <p style={s.cardFecha}>
                {sol.creadoEn?.toDate?.()?.toLocaleDateString('es-CL')}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Consultas */}
      {tabActivo === 'consultas' && (
        <div style={s.lista}>
          {consultas.length === 0 ? (
            <p style={s.vacio}>No tienes consultas aún.</p>
          ) : consultas.map((con) => (
            <div key={con.id} style={{ ...s.card, opacity: con.respondido ? 0.6 : 1 }}>
              <div style={s.cardEncabezado}>
                <div>
                  <p style={s.cardNombre}>{con.nombre}</p>
                  <p style={s.cardMeta}>{con.email}</p>
                </div>
                {con.respondido && (
                  <span style={{ ...s.estadoBadge, ...ESTADO_ESTILOS.aceptada }}>respondida</span>
                )}
              </div>
              <p style={s.cardDesc}>{con.mensaje}</p>
              {!con.respondido && (
                <button
                  onClick={() => updateDoc(doc(db, 'consultas', con.id), { respondido: true })}
                  style={s.botonMarcar}
                >
                  ✓ Marcar como respondida
                </button>
              )}
              <p style={s.cardFecha}>
                {con.creadoEn?.toDate?.()?.toLocaleDateString('es-CL')}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Chats */}
      {tabActivo === 'chats' && (
        <div style={s.lista}>
          {chats.length === 0 ? (
            <p style={s.vacio}>No tienes chats activos aún.</p>
          ) : chats.map((chat) => (
            <button key={chat.id} onClick={() => setChatAbierto(chat)} style={s.chatCard}>
              <div style={s.chatAvatar}>{chat.clienteNombre?.[0]}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p style={s.cardNombre}>{chat.clienteNombre}</p>
                <p style={s.ultimoMensaje}>{chat.ultimoMensaje || 'Sin mensajes aún'}</p>
              </div>
              <span style={{ fontSize: 20, color: '#1D9E75' }}>→</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  pagina:       { maxWidth: 640, margin: '0 auto', padding: '32px 24px 80px', minHeight: 'calc(100vh - 140px)' },
  centrado:     { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
  cargandoTexto:{ fontSize: 20, color: '#4b7062' },
  titulo:       { fontSize: 28, fontWeight: '900', color: '#0f2a22', margin: '0 0 6px' },
  subtitulo:    { fontSize: 16, color: '#4b7062', marginBottom: 24 },
  tabs:         { display: 'flex', borderBottom: '1.5px solid #e5e7eb', marginBottom: 20 },
  tab:          { flex: 1, padding: '12px 8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  badge:        { backgroundColor: '#F97316', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 12, fontWeight: '800' },
  lista:        { display: 'flex', flexDirection: 'column', gap: 14 },
  vacio:        { color: '#9ca3af', fontSize: 16, textAlign: 'center', padding: 32 },
  card:         { backgroundColor: '#fff', border: '2px solid #b7e4ce', borderRadius: 14, padding: '16px 18px' },
  cardEncabezado:{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardNombre:   { fontSize: 17, fontWeight: '800', color: '#0f2a22', margin: '0 0 2px' },
  cardMeta:     { fontSize: 13, color: '#4b7062', margin: '2px 0' },
  cardDesc:     { fontSize: 15, color: '#0f2a22', lineHeight: 1.5, margin: '0 0 10px', backgroundColor: '#f9fafb', padding: '10px 12px', borderRadius: 8 },
  cardFecha:    { fontSize: 12, color: '#9ca3af', margin: '8px 0 0', textAlign: 'right' },
  estadoBadge:  { padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: '700' },
  acciones:     { display: 'flex', gap: 10, marginBottom: 8 },
  botonAceptar: { padding: '8px 20px', fontSize: 14, backgroundColor: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontWeight: '700', cursor: 'pointer' },
  botonRechazar:{ padding: '8px 20px', fontSize: 14, backgroundColor: '#fff', color: '#dc2626', border: '2px solid #fca5a5', borderRadius: 8, fontWeight: '700', cursor: 'pointer' },
  botonMarcar:  { padding: '8px 18px', fontSize: 14, backgroundColor: '#f0fdf8', color: '#085041', border: '2px solid #b7e4ce', borderRadius: 8, fontWeight: '700', cursor: 'pointer', marginBottom: 4 },
  chatCard:     { display: 'flex', alignItems: 'center', gap: 14, backgroundColor: '#fff', border: '2px solid #b7e4ce', borderRadius: 14, padding: '14px 18px', cursor: 'pointer', width: '100%', boxSizing: 'border-box' },
  chatAvatar:   { width: 46, height: 46, borderRadius: '50%', backgroundColor: '#1D9E75', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: '800', flexShrink: 0 },
  ultimoMensaje:{ fontSize: 14, color: '#4b7062', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  botonVolver:  { background: 'none', border: '2px solid #1D9E75', borderRadius: 10, color: '#1D9E75', fontSize: 16, fontWeight: '700', padding: '8px 18px', cursor: 'pointer', marginBottom: 16 },
  chatConLabel: { fontSize: 18, color: '#0f2a22', marginBottom: 16 },
};

export default PanelMaestroPage;
