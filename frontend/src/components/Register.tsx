import React, { useState, type FormEvent } from 'react';
import { registerService } from '../services/auth.service';

interface RegisterProps {
  onVolverAlLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onVolverAlLogin }) => {
  const [matricula, setMatricula] = useState<string>('');
  const [nombre, setNombre] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [exito, setExito] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setExito('');

    try {
      await registerService(matricula, nombre, contrasena, 'especialista');
      setExito('¡Doctor registrado con éxito! Ya puedes iniciar sesión.');
      // Limpiar campos
      setMatricula('');
      setNombre('');
      setContrasena('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '400px', textAlign: 'center' }}>
        
        <div style={{ color: '#0091e6', fontSize: '2.5rem', marginBottom: '0.5rem' }}>🩺</div>
        <h2 style={{ margin: 0, color: '#1a2b49', fontSize: '1.8rem' }}>DentalCloud Pro</h2>
        <p style={{ color: '#7a8b9e', marginTop: '0.2rem', marginBottom: '2rem' }}>Registro de Especialista</p>

        {error && <p style={{ color: '#e03131', backgroundColor: '#ffe3e3', padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem' }}>{error}</p>}
        {exito && <p style={{ color: '#2b8a3e', backgroundColor: '#e3fafc', padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem' }}>{exito}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Matrícula Médica (ID único)" 
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            required
            style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
          />

          <input 
            type="text" 
            placeholder="Nombre Completo (Ej: Dr. Pérez)" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
          />

          <input 
            type="password" 
            placeholder="Contraseña" 
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
          />

          <button 
            type="submit" 
            style={{ backgroundColor: '#0091e6', color: 'white', border: 'none', padding: '1rem', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}
          >
            Registrarme
          </button>
        </form>

        <button 
          onClick={onVolverAlLogin}
          style={{ background: 'none', border: 'none', color: '#0091e6', marginTop: '1.5rem', cursor: 'pointer', fontSize: '0.95rem' }}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>

      </div>
    </div>
  );
};