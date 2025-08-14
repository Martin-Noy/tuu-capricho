import React, { useState } from 'react';
import { useUser } from '../context/UserContext.jsx';
import AddressForm from '../components/AddressForm.jsx';

//TO-DO: Persistir cambios de perfil y direcciones en backend, permitir editar/eliminar direcciones y mejorar validación de foto.
const Profile = () => {
  const { user, login } = useUser();
  const [form, setForm] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    secondName: user?.secondName || '',
    photoUrl: user?.photoUrl || '',
    addresses: user?.addresses || [],
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => ({ ...f, photoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Aquí podrías enviar los datos al backend
    login({ ...user, ...form });
  };

  const handleAddAddress = (address) => {
    setForm(f => ({ ...f, addresses: [...(f.addresses || []), address] }));
    setShowAddressForm(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2>Mi Perfil</h2>
  <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Foto de perfil:</label><br />
          {form.photoUrl && <img src={form.photoUrl} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 8 }} />}
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Nombre:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Segundo nombre:</label>
          <input type="text" name="secondName" value={form.secondName} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Apellido:</label>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required style={{ width: '100%', padding: 8 }} />
        </div>
        <button type="submit" style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer', width: '100%' }}>Guardar cambios</button>
  {/* Fin del formulario de perfil */}
      <div style={{ marginTop: 32 }}>
        <h3>Direcciones guardadas</h3>
        {form.addresses && form.addresses.length > 0 ? (
          <ul>
            {form.addresses.map((addr, idx) => (
              <li key={idx} style={{ marginBottom: 8 }}>
                <b>Facturación:</b> {addr.billing} <br />
                <b>Envío:</b> {addr.shipping}
              </li>
            ))}
          </ul>
        ) : <p>No tienes direcciones guardadas.</p>}
        <button onClick={() => setShowAddressForm(true)} style={{ marginTop: 16, background: '#27ae60', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>Agregar nueva dirección</button>
        {showAddressForm && <AddressForm onSave={handleAddAddress} />}
      </div>
      </form>
  </div>
  );
};

export default Profile;
