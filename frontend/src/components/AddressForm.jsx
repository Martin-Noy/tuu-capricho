import React, { useState } from 'react';

const AddressForm = ({ onSave }) => {
  const [form, setForm] = useState({
    billing: '',
    shipping: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h3>Direcciones</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Dirección de facturación:</label>
          <input type="text" name="billing" value={form.billing} onChange={handleChange} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Dirección de envío:</label>
          <input type="text" name="shipping" value={form.shipping} onChange={handleChange} required style={{ width: '100%', padding: 8 }} />
        </div>
        <button type="submit" style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer', width: '100%' }}>Guardar dirección</button>
      </form>
    </div>
  );
};

export default AddressForm;
