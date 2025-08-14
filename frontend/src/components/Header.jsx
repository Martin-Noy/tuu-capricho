import React from 'react';
import { Link } from 'react-router-dom';
import CartIcon from '../assets/agenda.png'; // Puedes cambiar el icono por uno de carrito

//TO-DO: Agregar notificaciones, menú responsive y personalización de avatar.
const Header = ({ cartCount, user, onLogout }) => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#333', textDecoration: 'none' }}>
        TUU Capricho
      </Link>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/products" style={{ color: '#333' }}>Productos</Link>
        <Link to="/customAgenda" style={{ color: '#e67e22' }}>Agenda Personalizada</Link>
        <Link to="/cart" style={{ position: 'relative' }}>
          <img src={CartIcon} alt="Carrito" style={{ width: 32, height: 32 }} />
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: -8, right: -8, background: '#e74c3c', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '0.8rem' }}>{cartCount}</span>
          )}
        </Link>
        {user ? (
          <>
            <Link to="/profile" style={{ color: '#333', display: 'flex', alignItems: 'center', gap: 8 }}>
              {user.photoUrl ? (
                <img src={user.photoUrl} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
              ) : (
                <span style={{ fontSize: 24, marginRight: 4 }}>👤</span>
              )}
              {user.name}
            </Link>
            <Link to="/orders" style={{ color: '#8e44ad' }}>Mis Órdenes</Link>
            <Link to="/contact" style={{ color: '#16a085' }}>Contacto</Link>
            {user.isAdmin && (
              <>
                <Link to="/admin" style={{ color: '#2980b9' }}>Panel Admin</Link>
                <Link to="/admin?section=ventas" style={{ color: '#c0392b' }}>Ventas</Link>
                <Link to="/admin?section=productos" style={{ color: '#8e44ad' }}>Productos</Link>
                <Link to="/admin?section=usuarios" style={{ color: '#27ae60' }}>Usuarios</Link>
              </>
            )}
            <button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#2980b9' }}>Login</Link>
            <Link to="/register" style={{ color: '#27ae60' }}>Registro</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
