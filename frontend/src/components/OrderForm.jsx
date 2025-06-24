// Formulario para realizar un pedido, ya sea físico o digital.
import React, { useState } from 'react';
import axios from 'axios';

const OrderForm = ({ pdfFilename, onOrderSuccess }) => {
  const [orderType, setOrderType] = useState('digital');
  const [customerDetails, setCustomerDetails] = useState({ email: '' });
  const [message, setMessage] = useState('');

  const handleTypeChange = (e) => {
    setOrderType(e.target.value);
    // Reinicia los detalles al cambiar el tipo
    setCustomerDetails(e.target.value === 'digital' ? { email: '' } : { address: '', city: '' });
  };

  const handleDetailChange = (e) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const payload = {
        orderType,
        customerDetails,
        pdfFilename,
      };
      
      await axios.post('http://localhost:8000/api/orders', payload);
      
      setMessage('¡Pedido realizado con éxito! Gracias por tu compra.');
      setTimeout(() => {
          onOrderSuccess(); // Cierra el formulario tras el éxito
      }, 2000);

    } catch (error) {
      setMessage('Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="orderType">Tipo de Pedido</label>
        <select id="orderType" value={orderType} onChange={handleTypeChange}>
          <option value="digital">Digital (Entrega por Email)</option>
          <option value="physical">Físico (Entrega a domicilio)</option>
        </select>
      </div>

      {orderType === 'digital' ? (
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={customerDetails.email || ''}
            onChange={handleDetailChange}
            required
          />
        </div>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="address">Dirección de Envío</label>
            <input
              type="text"
              id="address"
              name="address"
              value={customerDetails.address || ''}
              onChange={handleDetailChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">Ciudad</label>
            <input
              type="text"
              id="city"
              name="city"
              value={customerDetails.city || ''}
              onChange={handleDetailChange}
              required
            />
          </div>
        </>
      )}
      
      <button type="submit" className="btn">Confirmar Pedido</button>
      {message && <p style={{marginTop: '1rem', color: message.includes('error') ? 'red' : 'green'}}>{message}</p>}
    </form>
  );
};
export default OrderForm;