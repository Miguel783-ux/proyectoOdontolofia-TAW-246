import React from 'react';

interface LogAuditoria {
  id: number;
  usuario: string;
  ip: string;
  evento: 'ingreso' | 'salida' | 'accion';
  browser: string;
  fechaHora: string;
  detalles: string;
}

interface ReporteAuditoriaProps {
  logs: LogAuditoria[];
  onRegresar?: () => void;
}

export const ReporteAuditoria: React.FC<ReporteAuditoriaProps> = ({ logs, onRegresar }) => {
  
  // 📥 FUNCIÓN NATIVA QUE GENERA Y DESCARGA EL ARCHIVO .DOCX DE FORMA INMEDIATA
  const handleExportarWord = () => {
    if (logs.length === 0) {
      alert("No hay registros de auditoría para exportar.");
      return;
    }

    // 1. Cabecera XML/HTML compatible con Microsoft Word y estilos CSS integrados para diseño ejecutivo
    let contenidoHTML = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>Reporte de Auditoria - DentalCloud Pro</title>
        <style>
          @page {
            size: 21cm 29.7cm; /* A4 */
            margin: 2.5cm 2.5cm 2.5cm 2.5cm;
          }
          body {
            font-family: 'Arial', sans-serif;
            color: #334155;
            line-height: 1.5;
          }
          .header-title {
            font-size: 20pt;
            font-weight: bold;
            color: #0ea5e9;
            margin-bottom: 2pt;
          }
          .header-subtitle {
            font-size: 13pt;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 20pt;
            border-bottom: 2px solid #cbd5e1;
            padding-bottom: 5pt;
          }
          .meta-box {
            background-color: #f8fafc;
            padding: 10pt;
            margin-bottom: 15pt;
            font-size: 10pt;
          }
          .log-card {
            margin-bottom: 12pt;
            padding: 12pt;
            background-color: #ffffff;
            border: 1px solid #cbd5e1;
          }
          .badge-ingreso { color: #15803d; font-weight: bold; }
          .badge-salida { color: #b91c1c; font-weight: bold; }
          .badge-accion { color: #0369a1; font-weight: bold; }
          .log-details {
            font-size: 11pt;
            font-weight: bold;
            color: #1e293b;
            margin: 4pt 0;
          }
          .log-meta {
            font-size: 9pt;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="header-title">🩺 DentalCloud Pro</div>
        <div class="header-subtitle">REPORTE ANALÍTICO DE AUDITORÍA, SEGURIDAD Y TRANSACCIONES</div>
        
        <div class="meta-box">
          <strong>Fecha de Emisión:</strong> ${new Date().toLocaleString()}<br/>
          <strong>Área Académica:</strong> Auditoría de Sistemas (INF246)<br/>
          <strong>Estado del Sistema:</strong> Producción Sincronizada (MySQL/NestJS)
        </div>

        <h2>Historial de Registros Evaluados:</h2>
    `;

    // 2. Mapear dinámicamente cada log real acumulado en tu interfaz
    logs.forEach((log) => {
      let badgeClass = 'badge-accion';
      if (log.evento === 'ingreso') badgeClass = 'badge-ingreso';
      if (log.evento === 'salida') badgeClass = 'badge-salida';

      contenidoHTML += `
        <div class="log-card">
          <table width="100%" style="border:none;">
            <tr>
              <td align="left"><span class="${badgeClass}">[${log.evento.toUpperCase()}]</span></td>
              <td align="right" style="font-size:9pt; color:#64748b;">📅 ${log.fechaHora}</td>
            </tr>
          </table>
          <p class="log-details">${log.detalles}</p>
          <div class="log-meta">
            👤 Operador: <strong>${log.usuario}</strong> | 
            📍 Dirección IP: <strong>${log.ip}</strong> | 
            💻 Terminal: <strong>${log.browser}</strong>
          </div>
        </div>
      `;
    });

    // Cierre del documento HTML
    contenidoHTML += `
      </body>
      </html>
    `;

    // 3. Crear el Blob con el MIME Type oficial de Microsoft Word (.doc/.docx)
    const blob = new Blob(['\ufeff' + contenidoHTML], {
      type: 'application/msword'
    });

    // 4. Disparar la descarga automática invisible en el navegador del cliente
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte_Auditoria_${new Date().toISOString().slice(0,10)}.doc`; // Se descarga listo para abrir en Word
    document.body.appendChild(link);
    link.click();
    
    // 5. Limpieza de memoria
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* CABECERA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.6rem' }}>📜 Reporte General de Auditoría</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Registro de transacciones, accesos y seguridad del sistema clínico (INF246)</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {/* BOTÓN REFACTORIZADO: Ahora ejecuta la descarga automática de forma inmediata */}
          <button 
            onClick={handleExportarWord} 
            style={{ padding: '0.6rem 1.2rem', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            📥 Exportar y Descargar Word (.doc)
          </button>
          {onRegresar && (
            <button 
              onClick={onRegresar} 
              style={{ padding: '0.6rem 1.2rem', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Volver
            </button>
          )}
        </div>
      </div>

      {/* RENDERIZADO DE LAS TARJETAS DE LOGS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {logs.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No existen transacciones registradas bajo este período clínico.</p>
        ) : (
          logs.map(log => (
            <div key={log.id} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ 
                  padding: '0.25rem 0.6rem', 
                  borderRadius: '6px', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  backgroundColor: log.evento === 'ingreso' ? '#dcfce7' : log.evento === 'salida' ? '#fee2e2' : '#e0f2fe', 
                  color: log.evento === 'ingreso' ? '#15803d' : log.evento === 'salida' ? '#b91c1c' : '#0369a1' 
                }}>
                  {log.evento.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>📅 {log.fechaHora}</span>
              </div>
              
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500', color: '#1e293b', fontSize: '0.95rem' }}>
                {log.detalles}
              </p>
              
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px dashed #e2e8f0', paddingTop: '0.5rem' }}>
                <span>👤 Usuario: <strong style={{ color: '#475569' }}>{log.usuario}</strong></span>
                <span>📍 Dirección IP: <strong style={{ color: '#475569' }}>{log.ip}</strong></span>
                <span>💻 Terminal: <strong style={{ color: '#475569' }}>{log.browser}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};