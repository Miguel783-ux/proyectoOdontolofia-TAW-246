import React, { useState } from 'react';

interface AuthScreenProps {
  onLoginSuccess: (usuario: { matricula: string; nombre: string; rol: string }) => void;
  registrarLogAuditoria: (evento: 'ingreso' | 'salida' | 'accion', detalles: string, matriculaUser?: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, registrarLogAuditoria }) => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [loginMatricula, setLoginMatricula] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [num1, setNum1] = useState(() => Math.floor(Math.random() * 8) + 2);
  const [num2, setNum2] = useState(() => Math.floor(Math.random() * 8) + 2);
  const [captchaInput, setCaptchaInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [regMatricula, setRegMatricula] = useState('');
  const [regNombre, setRegNombre] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Lógica de validación de fuerza
  const evaluarFuerzaPassword = (pwd: string) => {
    if (pwd.length < 6) return 'débil';
    if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return 'intermedio';
    return 'fuerte';
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const captchaRealCalculado = (num1 + num2).toString();

    try {
      setAuthError('');
      
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricula: loginMatricula.trim(),
          contrasena: loginPassword,
          captchaIngresado: captchaInput,
          captchaReal: captchaRealCalculado
        })
      });

      if (!response.ok) throw new Error('Credenciales incorrectas o Captcha inválido');

      const data = await response.json();
      onLoginSuccess({
        matricula: data.usuario?.matricula || loginMatricula,
        nombre: data.usuario?.nombre || 'Odontólogo',
        rol: data.usuario?.rol || 'odontologo'
      });
      registrarLogAuditoria('ingreso', 'Inicio de sesión exitoso', loginMatricula);
    } catch (err: any) {
      setAuthError(`❌ ${err.message}`);
      setNum1(Math.floor(Math.random() * 8) + 2);
      setNum2(Math.floor(Math.random() * 8) + 2);
      setCaptchaInput('');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const fuerza = evaluarFuerzaPassword(regPassword);
    if (fuerza === 'débil') {
      alert('❌ Contraseña débil. Debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const response = await fetch('https://tu-backend-en-render.onrender.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          matricula: regMatricula.trim(), 
          nombre: regNombre, 
          contrasena: regPassword, 
          rol: 'odontologo' 
        })
      });
      if (!response.ok) throw new Error('Error al registrar usuario');
      
      alert(`✅ Registro exitoso (Nivel: ${fuerza})`);
      setIsRegisterMode(false);
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setIsRegisterMode(false)} style={{ flex: 1, padding: '0.5rem', background: !isRegisterMode ? '#e0f2fe' : 'none', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>🔐 Login</button>
          <button onClick={() => setIsRegisterMode(true)} style={{ flex: 1, padding: '0.5rem', background: isRegisterMode ? '#dcfce7' : 'none', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>👤 Registro</button>
        </div>

        {authError && <p style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem' }}>{authError}</p>}

        {!isRegisterMode ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Matrícula" value={loginMatricula} onChange={e => setLoginMatricula(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input type="password" placeholder="Contraseña" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <p>¿Cuánto es {num1} + {num2}?</p>
            <input type="number" placeholder="Resultado Captcha" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <button type="submit" style={{ padding: '0.8rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Ingresar</button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Nueva Matrícula" value={regMatricula} onChange={e => setRegMatricula(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="Nombre completo" value={regNombre} onChange={e => setRegNombre(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input type="password" placeholder="Contraseña (mín 6 caracteres)" value={regPassword} onChange={e => setRegPassword(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <button type="submit" style={{ padding: '0.8rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Guardar Médico</button>
          </form>
        )}
      </div>
    </div>
  );
};