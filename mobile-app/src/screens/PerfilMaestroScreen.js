import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, ScrollView } from 'react-native';
import { getMaestroById } from '../services/api';

export default function PerfilMaestroScreen({ route }) {
  const { id } = route.params;
  const [maestro, setMaestro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMaestroById(id)
      .then((res) => setMaestro(res.data))
      .catch(() => setError('No se encontró el perfil.'))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return <ActivityIndicator style={s.centro} size="large" color="#2563eb" />;
  if (error) return <Text style={s.error}>{error}</Text>;

  const abrirWhatsApp = () => {
    const mensaje = `Hola ${maestro.nombre}, te contacto desde Maestros Chile.`;
    Linking.openURL(`https://wa.me/56?text=${encodeURIComponent(mensaje)}`);
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={s.encabezado}>
        <View style={s.avatar}>
          <Text style={s.avatarLetra}>{maestro.nombre?.[0]}</Text>
        </View>
        <View>
          <Text style={s.nombre}>{maestro.nombre}</Text>
          <Text style={s.oficio}>{maestro.oficio} · {maestro.comuna}</Text>
          {maestro.disponible && <Text style={s.disponible}>✓ Disponible</Text>}
        </View>
      </View>

      <View style={s.seccion}>
        <Text style={s.seccionTitulo}>Sobre el maestro</Text>
        <Text style={s.texto}>{maestro.descripcion || 'Sin descripción.'}</Text>
      </View>

      <View style={s.seccion}>
        <Text style={s.seccionTitulo}>Precio por hora</Text>
        <Text style={s.precio}>${maestro.precioPorHora?.toLocaleString('es-CL')} CLP</Text>
      </View>

      <TouchableOpacity style={s.botonWhatsApp} onPress={abrirWhatsApp}>
        <Text style={s.botonTexto}>Contactar por WhatsApp</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  centro: { flex: 1, justifyContent: 'center' },
  error: { textAlign: 'center', color: 'red', marginTop: 60 },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 28 },
  avatar: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#2563eb',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarLetra: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  nombre: { fontSize: 22, fontWeight: 'bold' },
  oficio: { color: '#6b7280', marginTop: 2 },
  disponible: { color: '#16a34a', marginTop: 4, fontSize: 13 },
  seccion: { marginBottom: 20 },
  seccionTitulo: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  texto: { color: '#374151', lineHeight: 22 },
  precio: { fontSize: 22, fontWeight: 'bold', color: '#111' },
  botonWhatsApp: {
    backgroundColor: '#16a34a', padding: 16, borderRadius: 10, marginTop: 12,
  },
  botonTexto: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' },
});
