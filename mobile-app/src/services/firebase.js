import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDRQwKMKFNvuDwn4sJlTT8YUbbYTJ3jkKo',
  authDomain: 'maestros-chile.firebaseapp.com',
  projectId: 'maestros-chile',
  storageBucket: 'maestros-chile.firebasestorage.app',
  messagingSenderId: '355233640304',
  appId: '1:355233640304:web:2272e4259cb206d3db69b5',
};

const app = initializeApp(firebaseConfig);

// Usa AsyncStorage para mantener la sesión aunque se cierre la app
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
