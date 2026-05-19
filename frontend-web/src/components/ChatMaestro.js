import { useEffect, useRef, useState } from 'react';
import {
  collection, doc, addDoc, onSnapshot,
  query, orderBy, setDoc, serverTimestamp, getDoc,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

// El ID del chat se genera combinando los dos UIDs para que sea único y repetible
function getChatId(maestroId, clienteId) {
  return [maestroId, clienteId].sort().join('_');
}

function ChatMaestro({ maestroId, maestroNombre }) {
  const { usuario } = useAuth();
  const [mensajes, setMensajes]   = useState([]);
  const [texto, setTexto]         = useState('');
  const [enviando, setEnviando]   = useState(false);
  const [iniciando, setIniciando] = useState(true);
  const bottomRef = useRef(null);

  const chatId = usuario ? getChatId(maestroId, usuario.uid) : null;

  // Crea el documento del chat si no existe y suscribe a mensajes en tiempo real
  useEffect(() => {
    if (!chatId) return;

    const chatRef = doc(db, 'chats', chatId);
    getDoc(chatRef).then((snap) => {
      if (!snap.exists()) {
        setDoc(chatRef, {
          maestroId,
          maestroNombre,
          clienteId:     usuario.uid,
          clienteNombre: usuario.displayName || usuario.email,
          ultimoMensaje: '',
          ultimaActividad: serverTimestamp(),
        });
      }
    });

    const q = query(
      collection(db, 'chats', chatId, 'mensajes'),
      orderBy('creadoEn', 'asc')
    );

    const unsub = onSnapshot(q, (snap) => {
      setMensajes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setIniciando(false);
    });

    return unsub;
  }, [chatId, maestroId, maestroNombre, usuario]);

  // Scroll al fondo cuando llegan mensajes nuevos
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const handleEnviar = async (e) => {
    e.preventDefault();
    const textoLimpio = texto.trim();
    if (!textoLimpio || enviando) return;
    setEnviando(true);
    setTexto('');
    try {
      await addDoc(collection(db, 'chats', chatId, 'mensajes'), {
        texto:      textoLimpio,
        autorId:    usuario.uid,
        autorNombre: usuario.displayName || usuario.email,
        esCliente:  true,
        creadoEn:   serverTimestamp(),
      });
      // Actualiza el resumen del chat
      await setDoc(doc(db, 'chats', chatId), {
        ultimoMensaje:   textoLimpio,
        ultimaActividad: serverTimestamp(),
      }, { merge: true });
    } catch {
      setTexto(textoLimpio);
    } finally {
      setEnviando(false);
    }
  };

  if (!usuario) {
    return (
      <div style={s.loginAviso}>
        <p style={{ fontSize: 36, margin: '0 0 8px' }}>💬</p>
        <p style={s.loginTitulo}>Inicia sesión para chatear</p>
        <p style={s.loginDesc}>Necesitas una cuenta para contactar al maestro por chat.</p>
        <a href="/login" style={s.botonLogin}>Ingresar / Crear cuenta</a>
      </div>
    );
  }

  if (iniciando) {
    return <div style={s.cargando}>Conectando chat...</div>;
  }

  return (
    <div style={s.contenedor}>
      {/* Área de mensajes */}
      <div style={s.mensajesArea}>
        {mensajes.length === 0 ? (
          <div style={s.sinMensajes}>
            <p style={{ fontSize: 32, margin: '0 0 8px' }}>👋</p>
            <p style={{ fontSize: 15, color: '#4b7062' }}>
              Saluda a <strong>{maestroNombre}</strong> para iniciar la conversación.
            </p>
          </div>
        ) : (
          mensajes.map((m) => {
            const esPropio = m.autorId === usuario.uid;
            return (
              <div key={m.id} style={{
                ...s.burbuja,
                alignSelf: esPropio ? 'flex-end' : 'flex-start',
                backgroundColor: esPropio ? '#1D9E75' : '#f0fdf8',
                color: esPropio ? '#fff' : '#0f2a22',
                borderRadius: esPropio ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              }}>
                {!esPropio && (
                  <p style={s.autorNombre}>{m.autorNombre}</p>
                )}
                <p style={s.burbujaTexto}>{m.texto}</p>
                {m.creadoEn && (
                  <p style={{ ...s.burbujaHora, color: esPropio ? 'rgba(255,255,255,0.7)' : '#9ca3af' }}>
                    {m.creadoEn.toDate?.()?.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input de mensaje */}
      <form onSubmit={handleEnviar} style={s.inputArea}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe tu mensaje..."
          style={s.inputMensaje}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleEnviar(e)}
        />
        <button type="submit" disabled={!texto.trim() || enviando} style={s.botonEnviar}>
          ➤
        </button>
      </form>
    </div>
  );
}

const s = {
  contenedor:  { display: 'flex', flexDirection: 'column', height: 380 },
  mensajesArea:{
    flex: 1, overflowY: 'auto', padding: '12px 4px',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  sinMensajes: { textAlign: 'center', margin: 'auto', padding: 24 },
  burbuja:     { maxWidth: '78%', padding: '10px 14px', wordBreak: 'break-word' },
  autorNombre: { fontSize: 11, fontWeight: '700', color: '#1D9E75', margin: '0 0 2px' },
  burbujaTexto:{ fontSize: 15, margin: 0, lineHeight: 1.4 },
  burbujaHora: { fontSize: 11, margin: '4px 0 0', textAlign: 'right' },
  inputArea:   { display: 'flex', gap: 8, borderTop: '1.5px solid #e5e7eb', paddingTop: 12, marginTop: 4 },
  inputMensaje:{
    flex: 1, padding: '10px 14px', fontSize: 15,
    border: '2px solid #b7e4ce', borderRadius: 24,
    outline: 'none', fontFamily: 'inherit',
  },
  botonEnviar: {
    width: 44, height: 44, borderRadius: '50%',
    backgroundColor: '#1D9E75', color: '#fff', border: 'none',
    fontSize: 18, cursor: 'pointer', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  cargando:    { padding: 24, textAlign: 'center', color: '#4b7062', fontSize: 15 },
  loginAviso:  { textAlign: 'center', padding: '24px 16px' },
  loginTitulo: { fontSize: 20, fontWeight: '800', color: '#0f2a22', margin: '0 0 8px' },
  loginDesc:   { fontSize: 15, color: '#4b7062', marginBottom: 20 },
  botonLogin:  { display: 'inline-block', padding: '12px 24px', fontSize: 16, backgroundColor: '#1D9E75', color: '#fff', borderRadius: 10, fontWeight: '700', textDecoration: 'none' },
};

export default ChatMaestro;
