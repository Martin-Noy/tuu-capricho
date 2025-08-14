import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//TO-DO: Agregar validación de fuerza de contraseña, opción de recordar usuario y recuperación de contraseña.
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Aquí deberías llamar a tu API de login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.user);
        if (data.user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: 10, background: '#2980b9', color: '#fff', border: 'none', borderRadius: 4 }}>Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
