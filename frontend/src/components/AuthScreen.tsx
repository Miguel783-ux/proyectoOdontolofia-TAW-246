import React, { useState } from 'react';

interface AuthScreenProps {
  onLoginSuccess: (usuario: { matricula: string; nombre: string; rol: string }) => void;
  registrarLogAuditoria: (evento: 'ingreso' | 'salida' | 'accion', detalles: string, matriculaUser?: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, registrarLogAuditoria }) => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [loginMatricula, setLoginMatricula] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Generación aleatoria del filtro matemático de seguridad
  const [num1, setNum1] = useState(() => Math.floor(Math.random() * 8) + 2);
  const [num2, setNum2] = useState(() => Math.floor(Math.random() * 8) + 2);
  const [captchaInput, setCaptchaInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [regMatricula, setRegMatricula] = useState('');
  const [regNombre, setRegNombre] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const refrescarCaptcha = () => {
    setNum1(Math.floor(Math.random() * 8) + 2);
    setNum2(Math.floor(Math.random() * 8) + 2);
    setCaptchaInput('');
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error de autenticación');
      }

      const data = await response.json();
      const usuarioLogueado = {
        matricula: data.usuario?.matricula || loginMatricula,
        nombre: data.usuario?.nombre || `Especialista Verificado`,
        rol: data.usuario?.rol || 'odontologo'
      };
      
      onLoginSuccess(usuarioLogueado);
      registrarLogAuditoria('ingreso', `Inicio de sesión exitoso verificado en la Base de Datos.`, loginMatricula);
    } catch (err: any) {
      setAuthError(`❌ ${err.message || 'Credenciales o verificación captcha incorrectas.'}`);
      refrescarCaptcha();
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regMatricula || !regNombre || !regPassword) return alert('Por favor, rellene todos los campos.');

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula: regMatricula.trim(), nombre: regNombre, contrasena: regPassword, rol: 'odontologo' })
      });
      if (!response.ok) { 
        const errorData = await response.json(); 
        throw new Error(errorData.message); 
      }
      alert('¡Médico guardado con éxito en la Base de Datos!');
      setRegMatricula(''); setRegNombre(''); setRegPassword('');
      setIsRegisterMode(false);
    } catch (err: any) {
      alert(`❌ Error del Backend: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '420px' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <button type="button" onClick={() => { setIsRegisterMode(false); setAuthError(''); }} style={{ flex: 1, padding: '0.5rem', background: 'none', border: 'none', color: !isRegisterMode ? '#0ea5e9' : '#64748b', fontWeight: 'bold', cursor: 'pointer', borderBottom: !isRegisterMode ? '3px solid #0ea5e9' : 'none' }}>🔐 Ingresar</button>
          <button type="button" onClick={() => { setIsRegisterMode(true); setAuthError(''); }} style={{ flex: 1, padding: '0.5rem', background: 'none', border: 'none', color: isRegisterMode ? '#0ea5e9' : '#64748b', fontWeight: 'bold', cursor: 'pointer', borderBottom: isRegisterMode ? '3px solid #0ea5e9' : 'none' }}>👤 Registrar Médico</button>
        </div>

        {authError && <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem' }}>{authError}</p>}

        {!isRegisterMode ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Matrícula de Doctor" value={loginMatricula} onChange={e => setLoginMatricula(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <input type="password" placeholder="Contraseña de Acceso" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
              <span style={{ fontWeight: 'bold', color: '#0369a1', display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>Filtro de seguridad Bot:</span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a' }}>¿Cuánto es {num1} + {num2}?</span>
                <input type="number" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} required style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 'bold' }} />
              </div>
            </div>
            <button type="submit" style={{ padding: '0.8rem', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Entrar al Sistema</button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Nueva Matrícula Profesional" value={regMatricula} onChange={e => setRegMatricula(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <input type="text" placeholder="Nombre del Médico" value={regNombre} onChange={e => setRegNombre(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <input type="password" placeholder="Asignar Contraseña Segura" value={regPassword} onChange={e => setRegPassword(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <button type="submit" style={{ padding: '0.8rem', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>💾 Registrar en Base de Datos</button>
          </form>
        )}
      </div>
    </div>
  );
};