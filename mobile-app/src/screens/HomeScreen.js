import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const OFICIOS = [
  'Electricista', 'Gasfíter', 'Carpintero', 'Pintor',
  'Albañil', 'Cerrajero', 'Técnico en calefacción',
];

const COMUNAS = [
  'Peñalolén', 'Ñuñoa', 'La Florida', 'Providencia',
  'Santiago', 'Maipú', 'Las Condes', 'Pudahuel',
];

export default function HomeScreen({ navigation }) {
  const [oficio, setOficio] = useState('');
  const [comuna, setComuna] = useState('');

  const handleBuscar = () => {
    navigation.navigate('Maestros', { oficio, comuna });
  };

  return (
    <View style={s.container}>
      <Text style={s.titulo}>Encuentra un maestro en tu comuna</Text>
      <Text style={s.subtitulo}>Electricistas, gasfíteres, carpinteros y más.</Text>

      <Text style={s.label}>¿Qué necesitas?</Text>
      <View style={s.picker}>
        <Picker selectedValue={oficio} onValueChange={setOficio}>
          <Picker.Item label="Selecciona un oficio" value="" />
          {OFICIOS.map((o) => <Picker.Item key={o} label={o} value={o} />)}
        </Picker>
      </View>

      <Text style={s.label}>Tu comuna</Text>
      <View style={s.picker}>
        <Picker selectedValue={comuna} onValueChange={setComuna}>
          <Picker.Item label="Selecciona tu comuna" value="" />
          {COMUNAS.map((c) => <Picker.Item key={c} label={c} value={c} />)}
        </Picker>
      </View>

      <TouchableOpacity style={s.boton} onPress={handleBuscar}>
        <Text style={s.botonTexto}>Buscar maestro</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitulo: { color: '#666', marginBottom: 32, textAlign: 'center' },
  label: { fontSize: 14, color: '#374151', marginBottom: 4, marginTop: 12 },
  picker: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, marginBottom: 4 },
  boton: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, marginTop: 24 },
  botonTexto: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' },
});
