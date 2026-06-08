import React, { useState, useEffect, type FormEvent } from 'react';
import { loginService } from '../services/auth.service';

// Definimos los tipos de las propiedades que recibe el componente
// Busca esta interfaz en la parte superior de Login.tsx y cámbiala por esta:
interface LoginProps {
  onLoginSuccess: (usuario: { matricula: string; nombre: string; rol: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [matricula, setMatricula] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [captchaIngresado, setCaptchaIngresado] = useState<string>('');
  const [captchaReal, setCaptchaReal] = useState<string>('');
  const [error, setError] = useState<string>('');

  const generarCaptcha = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resultado = '';
    for (let i = 0; i < 5; i++) {
      resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setCaptchaReal(resultado);
  };

  useEffect(() => {
    generarCaptcha();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginService(matricula, contrasena, captchaIngresado, captchaReal);
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      onLoginSuccess(data.usuario);
    } catch (err) {
      // Corrección del tipo 'unknown' en el catch
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado');
      }
      generarCaptcha();
      setCaptchaIngresado('');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '400px', textAlign: 'center' }}>
        
        <div style={{ color: '#0091e6', fontSize: '2.5rem', marginBottom: '0.5rem' }}>🩺</div>
        <h2 style={{ margin: 0, color: '#1a2b49', fontSize: '1.8rem' }}>DentalCloud Pro</h2>
        <p style={{ color: '#7a8b9e', marginTop: '0.2rem', marginBottom: '2rem' }}>Panel de Especialista</p>

        {error && <p style={{ color: '#e03131', backgroundColor: '#ffe3e3', padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <input 
            type="text" 
            placeholder="Matrícula / Usuario" 
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#e6f4ff', padding: '0.8rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#0066cc', letterSpacing: '4px', textTransform: 'uppercase', userSelect: 'none' }}>
              {captchaReal}
            </span>
            <input 
              type="text" 
              placeholder="Validar" 
              value={captchaIngresado}
              onChange={(e) => setCaptchaIngresado(e.target.value)}
              required
              style={{ width: '100px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #bcd7f5', fontSize: '1rem', textAlign: 'center', outline: 'none' }}
            />
          </div>

          {/* Corrección de la propiedad 'style' en EventTarget usando CSS inline estándar */}
          <button 
            type="submit" 
            style={{ 
              backgroundColor: '#0091e6', 
              color: 'white', 
              border: 'none', 
              padding: '1rem', 
              borderRadius: '10px', 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              marginTop: '0.5rem' 
            }}
          >
            Acceder al Sistema
          </button>
        </form>

      </div>
    </div>
  );
};