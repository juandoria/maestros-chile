import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    setError('');
    setCargando(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // AuthContext detecta el cambio y redirige automáticamente
    } catch {
      setError('Email o contraseña incorrectos.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={s.titulo}>Iniciar sesión</Text>

      <TextInput
        style={s.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={s.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={s.error}>{error}</Text> : null}

      <TouchableOpacity style={s.boton} onPress={handleLogin} disabled={cargando}>
        <Text style={s.botonTexto}>{cargando ? 'Ingresando...' : 'Ingresar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
        <Text style={s.link}>¿No tienes cuenta? <Text style={s.linkNegrita}>Regístrate aquí</Text></Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
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
