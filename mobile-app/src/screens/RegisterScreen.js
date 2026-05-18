import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { createPerfil } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', telefono: '', comuna: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (campo, valor) => setForm({ ...form, [campo]: valor });

  const handleRegistro = async () => {
    setError('');
    setCargando(true);
    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      await createPerfil({ nombre: form.nombre, telefono: form.telefono, comuna: form.comuna });
      // AuthContext detecta el cambio y redirige automáticamente
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Ese email ya está registrado.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Ocurrió un error. Intenta de nuevo.');
      }
    } finally {
      setCargando(false);
    }
  };

  const campos = [
    { key: 'nombre', placeholder: 'Nombre completo', tipo: 'default' },
    { key: 'email', placeholder: 'Email', tipo: 'email-address' },
    { key: 'password', placeholder: 'Contraseña (mín. 6 caracteres)', tipo: 'default', seguro: true },
    { key: 'telefono', placeholder: 'Teléfono (ej: +56912345678)', tipo: 'phone-pad' },
    { key: 'comuna', placeholder: 'Tu comuna', tipo: 'default' },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.titulo}>Crear cuenta</Text>

        {campos.map(({ key, placeholder, tipo, seguro }) => (
          <TextInput
            key={key}
            style={s.input}
            placeholder={placeholder}
            value={form[key]}
            onChangeText={(v) => handleChange(key, v)}
            keyboardType={tipo}
            autoCapitalize="none"
            secureTextEntry={!!seguro}
          />
        ))}

        {error ? <Text style={s.error}>{error}</Text> : null}

        <TouchableOpacity style={s.boton} onPress={handleRegistro} disabled={cargando}>
          <Text style={s.botonTexto}>{cargando ? 'Creando cuenta...' : 'Registrarse'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={s.link}>¿Ya tienes cuenta? <Text style={s.linkNegrita}>Inicia sesión</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { padding: 24, paddingTop: 48 },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 28, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8,
    padding: 14, fontSize: 16, marginBottom: 12,
  },
  error: { color: 'red', fontSize: 14, marginBottom: 8 },
  boton: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, marginBottom: 16 },
  botonTexto: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', color: '#6b7280' },
  linkNegrita: { color: '#2563eb', fontWeight: '600' },
});
