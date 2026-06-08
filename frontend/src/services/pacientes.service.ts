// 💡 URL Base centralizada del Servidor NestJS
// Si tu backend usa prefijo global, cambia esto a 'http://localhost:3000/api'
const BASE_URL = 'http://localhost:3000';

const PACIENTES_URL = `${BASE_URL}/pacientes`;
const LOGS_URL = `${BASE_URL}/logs`;

export interface PacienteData {
  id: number;
  nombre: string;
  tratamiento: string;
  fechaCita: string;
  estado: string; 
}

// 1. Obtener Pacientes del Especialista
export const obtenerPacientes = async (matricula: string): Promise<PacienteData[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${PACIENTES_URL}?matricula=${matricula}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error(`Error al cargar pacientes (Status: ${response.status})`);
  return response.json();
};

// 2. Agendar un Nuevo Paciente
export const agendarPaciente = async (nombre: string, tratamiento: string, fechaCita: string, matricula: string): Promise<PacienteData> => {
  const token = localStorage.getItem('token');
  const response = await fetch(PACIENTES_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // Cambiado aquí para enviar "matricula" directo al DTO de NestJS
    body: JSON.stringify({ nombre, tratamiento, fechaCita, matricula }), 
  });
  if (!response.ok) throw new Error('Error al agendar el paciente');
  return response.json();
};

// 3. Actualizar Estado o Fecha del Paciente (¡El que modificamos para la orden del día!)
export const actualizarPaciente = async (id: number, datosActualizados: Partial<PacienteData>): Promise<PacienteData> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${PACIENTES_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosActualizados),
  });
  if (!response.ok) throw new Error(`Error al actualizar el paciente (Status: ${response.status})`);
  return response.json();
};

// 4. Eliminar Cita de Paciente
export const eliminarPaciente = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${PACIENTES_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error(`Error al eliminar paciente (Status: ${response.status})`);
};

// 5. Registrar Log de Auditoría (CORREGIDO: Ahora incluye Token de Seguridad)
export const registrarLog = async (matricula: string, accion: string, detalles: string): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await fetch(LOGS_URL, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ matricula, accion, detalles })
  });
  if (!response.ok) console.error(`No se pudo registrar el log en auditoría. Código: ${response.status}`);
};

// 6. Obtener Historial de Logs (CORREGIDO: Valida 'undefined' e incluye Token)
export const obtenerLogs = async (matricula: string) => {
  // Si por asincronía de React llega 'undefined' como texto o vacío, frena la petición corrupta
  if (!matricula || matricula === 'undefined') {
    return [];
  }

  const token = localStorage.getItem('token');
  const response = await fetch(`${LOGS_URL}?matricula=${matricula}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) throw new Error(`Error al obtener el historial de auditoría (Status: ${response.status})`);
  return response.json();
};