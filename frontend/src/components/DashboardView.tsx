import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { type PacienteData } from '../services/pacientes.service';

interface DashboardViewProps {
  pacientes: PacienteData[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ pacientes }) => {
  // Procesamiento reactivo de los estados para el gráfico
  const dataGrafico = [
    { name: 'Pendientes', cantidad: pacientes.filter(p => p.estado === 'pendiente' || !p.estado).length },
    { name: 'En Proceso', cantidad: pacientes.filter(p => p.estado === 'realizando').length },
    { name: 'Retrasados', cantidad: pacientes.filter(p => p.estado === 'retrasado').length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ color: '#1e293b', margin: 0 }}>Panel Estadístico Dental</h1>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', height: '380px' }}>
        {/* 📊 minWidth={0} previene el warning de dimensiones inválidas de la librería */}
        <ResponsiveContainer width="100%" height="90%" minWidth={0}>
          <BarChart data={dataGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" name="Pacientes" radius={[8, 8, 0, 0]}>
              {dataGrafico.map((_, idx) => (
                <Cell key={idx} fill={idx === 0 ? '#cbd5e1' : idx === 1 ? '#0ea5e9' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};