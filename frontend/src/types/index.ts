export interface Cita {
  id: number;
  paciente: string;
  servicio: string;
  fecha: string;
  activo: boolean;
}

export interface Paciente {
  id: number;
  nombre: string;
  historial: string;
  ultimaVisita: string;
}

export type VistaActual = 'citas' | 'pacientes' | 'reportes';