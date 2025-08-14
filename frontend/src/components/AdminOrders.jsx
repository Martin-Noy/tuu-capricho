import React, { useEffect, useState } from 'react';

//TO-DO: Agregar filtros por fecha, exportar datos y ver detalles de cada orden.
const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(async res => {
        if (res.status === 401) {
          setDashboard({ error: 'No autorizado. Inicia sesión como admin.' });
          setLoading(false);
          return;
        }
        const data = await res.json();
        setDashboard(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando resumen...</p>;
  if (!dashboard || dashboard.error) return <p>{dashboard?.error || 'No hay datos de ventas.'}</p>;

  return (
    <div style={{ marginTop: 32 }}>
      <h3>Resumen de ventas</h3>
      <div style={{ marginBottom: 24 }}>
        <b>Agendas físicas vendidas:</b> {dashboard.agendasFisicas ?? 0}<br />
        <b>Agendas digitales vendidas:</b> {dashboard.agendasDigitales ?? 0}<br />
        <b>Ganancia total:</b> ${dashboard.totalGanancia ? dashboard.totalGanancia.toFixed(2) : '0.00'}
      </div>
      <h4>Productos vendidos</h4>
      <table style={{ width: '100%', marginTop: 16 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Valor total</th>
            <th>Ganancia</th>
          </tr>
        </thead>
        <tbody>
          {dashboard.productosVendidos && Object.entries(dashboard.productosVendidos).map(([pid, prod]) => (
            <tr key={pid}>
              <td>{pid}</td>
              <td>{prod.nombre}</td>
              <td>{prod.cantidad}</td>
              <td>${prod.valor ? prod.valor.toFixed(2) : '0.00'}</td>
              <td>${prod.ganancia ? prod.ganancia.toFixed(2) : '0.00'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
