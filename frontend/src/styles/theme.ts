import React from 'react';

export const styles: { [key: string]: React.CSSProperties } = {
  authContainer: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px' },
  authCard: { background: 'white', padding: '40px', borderRadius: '20px', width: '380px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' },
  captchaBox: { background: '#f0f9ff', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', border: '1px solid #bae6fd' },
  captchaText: { fontWeight: 'bold', fontSize: '20px', letterSpacing: '4px', color: '#0369a1', fontFamily: 'monospace' },
  buttonPrimary: { width: '100%', padding: '14px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  dashboardContainer: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' },
  sidebar: { width: '260px', background: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  navItem: { padding: '15px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '8px', margin: '5px 10px', transition: '0.3s' },
  mainContent: { flex: 1, padding: '40px', overflowY: 'auto' },
  itemCard: { background: 'white', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #0ea5e9', marginBottom: '15px' },
  card: { background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  buttonPdf: { marginTop: '20px', width: '100%', padding: '12px', background: '#475569', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }
};