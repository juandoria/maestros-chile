import { useEffect, useRef, useState } from 'react';
import {
  collection, addDoc, onSnapshot,
  query, orderBy, setDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

function ChatPanelMaestro({ chatId, maestroId }) {
  const { usuario } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto]       = useState('');
  const [enviando, setEnviando] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, 'chats', chatId, 'mensajes'),
      orderBy('creadoEn', 'asc')
    );
    return onSnapshot(q, (snap) => {
      setMensajes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [chatId]);

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
        autorNombre: usuario.displayName || 'Maestro',
        esCliente:  false,
        creadoEn:   serverTimestamp(),
      });
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

  return (
    <div style={s.contenedor}>
      <div style={s.mensajesArea}>
        {mensajes.length === 0 && (
          <p style={s.sinMensajes}>No hay mensajes aún.</p>
        )}
        {mensajes.map((m) => {
          const esPropio = m.autorId === usuario.uid;
          return (
            <div key={m.id} style={{
              ...s.burbuja,
              alignSelf:       esPropio ? 'flex-end' : 'flex-start',
              backgroundColor: esPropio ? '#1D9E75' : '#f0fdf8',
              color:           esPropio ? '#fff' : '#0f2a22',
              borderRadius:    esPropio ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            }}>
              {!esPropio && <p style={s.autorNombre}>{m.autorNombre}</p>}
              <p style={s.burbujaTexto}>{m.texto}</p>
              {m.creadoEn && (
                <p style={{ ...s.burbujaHora, color: esPropio ? 'rgba(255,255,255,0.7)' : '#9ca3af' }}>
                  {m.creadoEn.toDate?.()?.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleEnviar} style={s.inputArea}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Responde al cliente..."
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
  contenedor:   { display: 'flex', flexDirection: 'column', height: 460, border: '2px solid #b7e4ce', borderRadius: 14, overflow: 'hidden' },
  mensajesArea: { flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 },
  sinMensajes:  { textAlign: 'center', color: '#9ca3af', fontSize: 15, margin: 'auto' },
  burbuja:      { maxWidth: '78%', padding: '10px 14px', wordBreak: 'break-word' },
  autorNombre:  { fontSize: 11, fontWeight: '700', color: '#1D9E75', margin: '0 0 2px' },
  burbujaTexto: { fontSize: 15, margin: 0, lineHeight: 1.4 },
  burbujaHora:  { fontSize: 11, margin: '4px 0 0', textAlign: 'right' },
  inputArea:    { display: 'flex', gap: 8, borderTop: '1.5px solid #e5e7eb', padding: '12px 16px' },
  inputMensaje: { flex: 1, padding: '10px 14px', fontSize: 15, border: '2px solid #b7e4ce', borderRadius: 24, outline: 'none', fontFamily: 'inherit' },
  botonEnviar:  { width: 44, height: 44, borderRadius: '50%', backgroundColor: '#1D9E75', color: '#fff', border: 'none', fontSize: 18, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

export default ChatPanelMaestro;
