import React, { useState, useEffect } from 'react';
import { type PacienteData } from '../services/pacientes.service';
import { AuthScreen } from './AuthScreen';
import { DashboardView } from './DashboardView';
import { ReporteAuditoria } from './ReporteAuditoria';

interface DashboardCitasProps {
  usuario: { matricula: string; nombre: string; rol: string };
  onLogout: () => void;
}

interface LogAuditoria { 
  id: number; 
  usuario: string; 
  ip: string; 
  evento: 'ingreso' | 'salida' | 'accion'; 
  browser: string; 
  fechaHora: string; 
  detalles: string; 
}

export const DashboardCitas: React.FC<DashboardCitasProps> = ({ usuario, onLogout }) => {
  type Seccion = 'dashboard' | 'orden' | 'pacientes' | 'informes';
  const [seccionActiva, setSeccionActiva] = useState<Seccion>('dashboard');
  
  const [pacientes, setPacientes] = useState<PacienteData[]>([]);
  const [logs, setLogs] = useState<LogAuditoria[]>([]);
  const [error, setError] = useState<string>('');
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
  
  // Si la matrícula viene vacía desde App.tsx significa que debe loguearse primero
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(usuario.matricula !== '');
  const [usuarioActivo, setUsuarioActivo] = useState(usuario);

  const [editandoFechaId, setEditandoFechaId] = useState<number | null>(null);
  const [nuevaFechaSeleccionada, setNuevaFechaSeleccionada] = useState<string>('');
  
  const [formNombre, setFormNombre] = useState('');
  const [formTratamiento, setFormTratamiento] = useState('Limpieza Dental');
  const [formFecha, setFormFecha] = useState('');

  const registrarLogAuditoria = async (evento: 'ingreso' | 'salida' | 'accion', detalles: string, matriculaUser?: string) => {
    const userAgent = navigator.userAgent;
    let browserName = "Google Chrome";
    if (userAgent.includes("Firefox")) browserName = "Mozilla Firefox";

    const nuevoLog: LogAuditoria = {
      id: Date.now(),
      usuario: matriculaUser || usuarioActivo?.matricula || 'Desconocido',
      ip: '192.168.1.45',
      evento: evento,
      browser: browserName,
      fechaHora: new Date().toLocaleString(),
      detalles: detalles
    };
    setLogs(prev => [nuevoLog, ...prev]);
  };

  const cargarDatosDesdeBD = async () => {
    try {
      setError('');
      const response = await fetch(`http://localhost:3000/pacientes`);
      if (!response.ok) throw new Error();
      const datos = await response.json();
      setPacientes(datos);
    } catch (err) {
      setError("⚠️ Error: No se pudo conectar con la tabla de pacientes.");
    }
  };

  useEffect(() => { 
    if (isAuthenticated) cargarDatosDesdeBD(); 
  }, [isAuthenticated, seccionActiva]);

  const handleLoginExitosoIntegrado = (user: { matricula: string; nombre: string; rol: string }) => {
    localStorage.setItem('usuario', JSON.stringify(user));
    setUsuarioActivo(user);
    setIsAuthenticated(true);
  };

  const handleGuardarPacienteForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre || !formFecha) return alert('Campos obligatorios.');
    try {
      const res = await fetch('http://localhost:3000/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: formNombre, tratamiento: formTratamiento, fechaCita: formFecha, doctorMatricula: usuarioActivo?.matricula })
      });
      if (!res.ok) throw new Error();
      alert('¡Paciente insertado en la Base de Datos!');
      registrarLogAuditoria('accion', `Registró al paciente "${formNombre}".`);
      setFormNombre(''); setFormFecha(''); setMostrarFormulario(false);
      cargarDatosDesdeBD();
    } catch (err) {
      alert('Error al insertar paciente.');
    }
  };

  const handleCambiarEstado = async (id: number, nombre: string, nuevoEstado: string) => {
    try {
      // 🛡️ Convierte estrictamente a Number para enlazar con phpMyAdmin sin fallos de ruta (Evita 404)
      const response = await fetch(`http://localhost:3000/pacientes/${Number(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (response.ok) {
        setPacientes(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
        registrarLogAuditoria('accion', `Cambió estado de "${nombre}" a [${nuevoEstado.toUpperCase()}].`);
      } else {
        alert('El servidor rechazó la actualización del estado.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGuardarNuevaFecha = async (id: number, nombre: string, fechaAnterior: string) => {
    if (!nuevaFechaSeleccionada) return setEditandoFechaId(null);
    try {
      const response = await fetch(`http://localhost:3000/pacientes/${Number(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fechaCita: nuevaFechaSeleccionada })
      });
      if (response.ok) {
        setPacientes(prev => prev.map(p => p.id === id ? { ...p, fechaCita: nuevaFechaSeleccionada } : p));
        registrarLogAuditoria('accion', `Reprogramó a "${nombre}" de {${fechaAnterior}} a {${nuevaFechaSeleccionada}}.`);
        setEditandoFechaId(null); setNuevaFechaSeleccionada('');
      }
    } catch (err) {}
  };

  const handleEliminarPaciente = async (id: number, nombre: string) => {
    if (!confirm(`¿Desea eliminar a ${nombre}?`)) return;
    try {
      const response = await fetch(`http://localhost:3000/pacientes/${Number(id)}`, { method: 'DELETE' });
      if (response.ok) {
        setPacientes(prev => prev.filter(p => p.id !== id));
        registrarLogAuditoria('accion', `Eliminó al paciente "${nombre}" de la BD (Eliminación Lógica).`);
      }
    } catch (err) {}
  };

  if (!isAuthenticated) {
    return (
      <AuthScreen 
        onLoginSuccess={handleLoginExitosoIntegrado} 
        registrarLogAuditoria={registrarLogAuditoria} 
      />
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* SIDEBAR LATERAL */}
      <div style={{ width: '260px', backgroundColor: '#0f172a', color: 'white', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', margin: '0 0 2.5rem 0', color: '#38bdf8' }}>🩺 DentalCloud Pro</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={() => setSeccionActiva('dashboard')} style={{ width: '100%', padding: '0.75rem 1rem', background: seccionActiva === 'dashboard' ? '#1e293b' : 'transparent', border: 'none', borderRadius: '10px', color: 'white', textAlign: 'left', cursor: 'pointer' }}>📈 Dashboard Gráfico</button>
            <button onClick={() => { setSeccionActiva('orden'); setMostrarFormulario(false); }} style={{ width: '100%', padding: '0.75rem 1rem', background: seccionActiva === 'orden' ? '#1e293b' : 'transparent', border: 'none', borderRadius: '10px', color: 'white', textAlign: 'left', cursor: 'pointer' }}>📊 Orden del día</button>
            <button onClick={() => { setSeccionActiva('pacientes'); setMostrarFormulario(false); }} style={{ width: '100%', padding: '0.75rem 1rem', background: seccionActiva === 'pacientes' ? '#1e293b' : 'transparent', border: 'none', borderRadius: '10px', color: 'white', textAlign: 'left', cursor: 'pointer' }}>👥 Pacientes (CRUD)</button>
            <button onClick={() => { setSeccionActiva('informes'); setMostrarFormulario(false); }} style={{ width: '100%', padding: '0.75rem 1rem', background: seccionActiva === 'informes' ? '#1e293b' : 'transparent', border: 'none', borderRadius: '10px', color: 'white', textAlign: 'left', cursor: 'pointer' }}>📜 Informes Auditoría</button>
          </div>
        </div>
        <div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>👤 {usuarioActivo?.nombre}</p>
          <button onClick={() => { registrarLogAuditoria('salida', 'Cierre de sesión.'); setIsAuthenticated(false); onLogout(); }} style={{ width: '100%', padding: '0.6rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>🚪 Cerrar Sesión</button>
        </div>
      </div>

      {/* CONTENEDOR DE TRABAJO */}
      <div style={{ flex: 1, padding: '3rem' }}>
        {error && <div style={{ padding: '0.75rem', backgroundColor: '#fff1f2', color: '#9f1239', marginBottom: '1.5rem', borderRadius: '8px' }}>{error}</div>}
        
        {seccionActiva === 'dashboard' && <DashboardView pacientes={pacientes} />}
        
        {seccionActiva === 'orden' && (
          <div>
            <h1>Citas de la Semana</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pacientes.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{p.nombre}</h3>
                    {editandoFechaId === p.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '6px' }}>
                        <input type="date" value={nuevaFechaSeleccionada} onChange={e => setNuevaFechaSeleccionada(e.target.value)} style={{ padding: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                        <button onClick={() => handleGuardarNuevaFecha(p.id, p.nombre, p.fechaCita || '')} style={{ padding: '0.3rem 0.6rem', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>✔ OK</button>
                        <button onClick={() => setEditandoFechaId(null)} style={{ padding: '0.3rem 0.6rem', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>X</button>
                      </div>
                    ) : (
                      <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>📋 {p.tratamiento} | 📅 {p.fechaCita} | Estado: <strong>{(p.estado || 'pendiente').toUpperCase()}</strong></p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => { setEditandoFechaId(p.id); setNuevaFechaSeleccionada(p.fechaCita || ''); }} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', color: '#475569' }}>✏️ Fecha</button>
                    {/* 🛡️ Se vincula estrictamente p.id para que Ana López mande la petición al ID 2, no al ID 1 */}
                    <button onClick={() => handleCambiarEstado(p.id, p.nombre, 'realizando')} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#e3fafc', color: '#0c8599', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>⚡ Realizando</button>
                    <button onClick={() => handleCambiarEstado(p.id, p.nombre, 'retrasado')} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ffe3e3', color: '#c92a2a', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>⏳ Retrasado</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {seccionActiva === 'pacientes' && (
          <div>
            {!mostrarFormulario ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <h2>Listado Clínico</h2>
                  <button onClick={() => setMostrarFormulario(true)} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>➕ Registrar Paciente</button>
                </div>
                {pacientes.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', backgroundColor: 'white', borderRadius: '16px', marginBottom: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <div><h3>{p.nombre}</h3><p>{p.tratamiento} | {p.fechaCita}</p></div>
                    <button onClick={() => handleEliminarPaciente(p.id, p.nombre)} style={{ background: 'transparent', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>🗑️</button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '16px' }}>
                <h2>👥 Registrar Nuevo Paciente</h2>
                <form onSubmit={handleGuardarPacienteForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                  <input type="text" value={formNombre} onChange={e => setFormNombre(e.target.value)} placeholder="Nombre" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  <select value={formTratamiento} onChange={e => setFormTratamiento(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option value="Limpieza Dental">Limpieza Dental</option>
                    <option value="Ortodoncia">Ortodoncia</option>
                    <option value="Extracción">Extracción</option>
                    <option value="Blanqueamiento">Blanqueamiento</option>
                  </select>
                  <input type="date" value={formFecha} onChange={e => setFormFecha(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>💾 Guardar Paciente</button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* VISTA DE INFORMES: Desacoplada por completo del archivo maestro */}
{seccionActiva === 'informes' && (
  <ReporteAuditoria 
    logs={logs} 
    onRegresar={() => setSeccionActiva('dashboard')} 
  />
)}
      </div>
    </div>
  );
};