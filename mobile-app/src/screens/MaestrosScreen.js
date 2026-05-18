import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getMaestros } from '../services/api';

export default function MaestrosScreen({ route, navigation }) {
  const { oficio = '', comuna = '' } = route.params || {};
  const [maestros, setMaestros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMaestros(oficio, comuna)
      .then((res) => setMaestros(res.data))
      .catch(() => setError('No se pudieron cargar los maestros.'))
      .finally(() => setCargando(false));
  }, [oficio, comuna]);

  if (cargando) return <ActivityIndicator style={s.centro} size="large" color="#2563eb" />;

  if (error) return <Text style={s.error}>{error}</Text>;

  return (
    <View style={s.container}>
      <Text style={s.titulo}>
        {oficio || 'Maestros'}{comuna ? ` en ${comuna}` : ''}
      </Text>

      {maestros.length === 0 ? (
        <Text style={s.vacio}>No encontramos maestros con esos filtros.</Text>
      ) : (
        <FlatList
          data={maestros}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.tarjeta}
              onPress={() => navigation.navigate('PerfilMaestro', { id: item.id })}
            >
              <Text style={s.nombre}>{item.nombre}</Text>
              <Text style={s.oficio}>{item.oficio} · {item.comuna}</Text>
              <Text style={s.precio}>
                ${item.precioPorHora?.toLocaleString('es-CL')} / hora
              </Text>
              {item.disponible && <Text style={s.disponible}>✓ Disponible</Text>}
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
  centro: { flex: 1, justifyContent: 'center' },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  vacio: { textAlign: 'center', color: '#6b7280', marginTop: 60 },
  error: { textAlign: 'center', color: 'red', marginTop: 60 },
  tarjeta: {
    backgroundColor: '#fff', padding: 16, borderRadius: 10,
    marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb',
  },
  nombre: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  oficio: { color: '#6b7280', fontSize: 13, marginBottom: 6 },
  precio: { fontWeight: 'bold', marginBottom: 4 },
  disponible: { color: '#16a34a', fontSize: 13 },
});
