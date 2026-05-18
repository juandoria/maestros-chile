import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import SeccionDual from '../components/SeccionDual';
import TodosMaestros from '../components/TodosMaestros';
import ComoFunciona from '../components/ComoFunciona';
import { getMaestros } from '../services/api';

function HomePage() {
  const [destacados, setDestacados] = useState([]);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getMaestros()
      .then((res) => {
        const lista = res.data;
        const conDestacado = lista.filter((m) => m.destacado)
          .sort((a, b) => (b.calificacion || 0) - (a.calificacion || 0));
        const sinDestacado = lista.filter((m) => !m.destacado).slice(0, 6);
        setDestacados(conDestacado);
        setTodos(sinDestacado);
      })
      .catch(() => {
        // Si no hay conexión al backend, la página igual carga sin errores
      });
  }, []);

  return (
    <main>
      <HeroSection />
      <SeccionDual maestros={destacados} />
      <TodosMaestros maestros={todos} />
      <ComoFunciona />
    </main>
  );
}

export default HomePage;
