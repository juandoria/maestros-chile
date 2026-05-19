import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MaestrosPage from './pages/MaestrosPage';
import MaestroPerfilPage from './pages/MaestroPerfilPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MiPerfilMaestroPage from './pages/MiPerfilMaestroPage';
import PanelMaestroPage from './pages/PanelMaestroPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/maestros" element={<MaestrosPage />} />
          <Route path="/maestros/:id" element={<MaestroPerfilPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/registro-maestro" element={<RegisterPage />} />
          <Route path="/mi-perfil-maestro" element={<MiPerfilMaestroPage />} />
          <Route path="/panel" element={<PanelMaestroPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
