import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import MaestrosScreen from '../screens/MaestrosScreen';
import PerfilMaestroScreen from '../screens/PerfilMaestroScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { usuario } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#2563eb' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {usuario ? (
          // Pantallas para usuarios con sesión iniciada
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Maestros Chile' }} />
            <Stack.Screen name="Maestros" component={MaestrosScreen} options={{ title: 'Resultados' }} />
            <Stack.Screen name="PerfilMaestro" component={PerfilMaestroScreen} options={{ title: 'Perfil del maestro' }} />
          </>
        ) : (
          // Pantallas para usuarios sin sesión
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar sesión' }} />
            <Stack.Screen name="Registro" component={RegisterScreen} options={{ title: 'Crear cuenta' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
