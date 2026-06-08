import React from 'react';
import { Calendar, Users, BarChart3, LogOut, Activity } from 'lucide-react';
import { styles } from '../styles/theme';
import type { VistaActual } from '../types';

interface SidebarProps {
  vista: VistaActual;
  setVista: (v: VistaActual) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ vista, setVista, onLogout }) => (
  <nav style={styles.sidebar}>
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38bdf8' }}>
        <Activity size={24} />
        <h2 style={{ fontSize: '1.2rem' }}>Clínica Dental</h2>
      </div>
      <hr style={{ borderColor: '#1e293b', margin: '20px 0' }} />
      
      <div 
        onClick={() => setVista('citas')} 
        style={{ ...styles.navItem, color: vista === 'citas' ? '#38bdf8' : 'white', backgroundColor: vista === 'citas' ? '#1e293b' : 'transparent' }}
      >
        <Calendar size={20} /> Agenda
      </div>
      
      <div 
        onClick={() => setVista('pacientes')} 
        style={{ ...styles.navItem, color: vista === 'pacientes' ? '#38bdf8' : 'white', backgroundColor: vista === 'pacientes' ? '#1e293b' : 'transparent' }}
      >
        <Users size={20} /> Pacientes
      </div>
      
      <div 
        onClick={() => setVista('reportes')} 
        style={{ ...styles.navItem, color: vista === 'reportes' ? '#38bdf8' : 'white', backgroundColor: vista === 'reportes' ? '#1e293b' : 'transparent' }}
      >
        <BarChart3 size={20} /> Reportes
      </div>
    </div>

    <div onClick={onLogout} style={{ padding: '25px', cursor: 'pointer', color: '#94a3b8', display: 'flex', gap: '10px', borderTop: '1px solid #1e293b' }}>
      <LogOut size={20} /> Cerrar Sesión
    </div>
  </nav>
);