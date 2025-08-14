import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//TO-DO: Validar fuerza de contraseña, agregar confirmación de contraseña y verificación por email.
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // Aquí deberías llamar a tu API de registro
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Registro exitoso, ahora puedes iniciar sesión');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.message || 'Error al registrar');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Nombre</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
        <button type="submit" style={{ width: '100%', padding: 10, background: '#27ae60', color: '#fff', border: 'none', borderRadius: 4 }}>Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
