import React from 'react';
import AdminDashboard from '../components/AdminOrders.jsx';
import AdminAddProduct from '../components/AdminAddProduct.jsx';

const AdminPanel = () => {
  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2>Panel de Administración</h2>
      <ul style={{ fontSize: '1.2rem', marginTop: '2rem' }}>
        <li>Revisar productos</li>
        <li>Revisar PDFs</li>
        <li>Revisar órdenes</li>
        <li>Gestionar usuarios</li>
        <li>Configurar la web</li>
      </ul>
  <AdminDashboard />
  <AdminAddProduct />
    </div>
  );
};

export default AdminPanel;
