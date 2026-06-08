import { useState } from 'react';
import { DashboardCitas } from './components/DashboardCitas';

interface Usuario {
  matricula: string;
  nombre: string;
  rol: string;
}

function App() {
  // Recupera la sesión guardada en el navegador si existe
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const savedUser = localStorage.getItem('usuario');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <div className="App">
      {usuario ? (
        // Si ya está logueado, pasa el usuario real de la sesión
        <DashboardCitas usuario={usuario} onLogout={handleLogout} />
      ) : (
        // Si no hay sesión, se envía un objeto vacío para que DashboardCitas fuerce el Login integrado
        <DashboardCitas 
          usuario={{ matricula: '', nombre: '', rol: '' }} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}

export default App;