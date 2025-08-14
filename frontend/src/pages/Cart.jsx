import React, { useState, useEffect } from 'react';
import AddressForm from '../components/AddressForm.jsx';
import { Heading, Box } from '@chakra-ui/react';
import { useCart } from '../context/CartContext.jsx';
import { useUser } from '../context/UserContext.jsx';
//TO-DO: Validar stock antes de finalizar compra, mostrar resumen de orden y permitir cupones de descuento.
function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useUser();
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState({ billing: '', shipping: '' });

  useEffect(() => {
    setCustomerName(user?.name || '');
    setCustomerEmail(user?.email || '');
  }, [user]);

  const handleChange = (product, e) => {
    const value = Math.max(1, Math.min(Number(e.target.value), product.stock));
    updateQuantity(product.id, value, product.stock);
  };

  const total = cart.reduce((acc, item) => acc + item.product.basePrice * item.quantity, 0);

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const items = cart.map(item => ({ product: item.product, productId: item.product.id, quantity: item.quantity }));
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, customerEmail, items, userId: user?.id, addresses })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('¡Orden creada exitosamente!');
        clearCart();
      } else {
        setError(data.message || 'Error al crear la orden');
      }
    } catch (err) {
      setError('Error de conexión');
    }
    setLoading(false);
  };

  return (
    <Box p={8} maxW="700px" mx="auto" bg="white" borderRadius={8} boxShadow="md">
      <Heading as="h2" size="lg" mb={6}>Carrito de Compras</Heading>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <table style={{ width: '100%', marginBottom: '2rem' }}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.product.id}>
                  <td>
                    {item.product.name}
                    {item.product.isCustom && (
                      <div style={{ fontSize: '0.9rem', color: '#555', marginTop: 8 }}>
                        <b>Agenda personalizada</b><br />
                        <span>Tapa: {item.product.details.cover.title}</span><br />
                        <span>Páginas: {item.product.details.totalPages}</span><br />
                        <span>Secciones:</span>
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {item.product.details.sections.map((sec, idx) => (
                            <li key={idx}>{sec.section?.name || sec.section} - {sec.pages} pág.</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </td>
                  <td>${item.product.basePrice}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      max={item.product.stock}
                      value={item.quantity}
                      onChange={e => handleChange(item.product, e)}
                      style={{ width: 60 }}
                      disabled={item.product.isCustom}
                    />
                  </td>
                  <td>${item.product.basePrice * item.quantity}</td>
                  <td>
                    <button onClick={() => removeFromCart(item.product.id)} style={{ color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer' }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.2rem' }}>Total: ${total}</div>
          <form onSubmit={handleOrder} style={{ marginTop: 32, textAlign: 'left' }}>
            <div style={{ marginBottom: 16 }}>
              <label>Nombre:</label>
              <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} required style={{ width: '100%', padding: 8 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Email:</label>
              <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} required style={{ width: '100%', padding: 8 }} />
            </div>
            <AddressForm onSave={setAddresses} />
            {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: 16 }}>{success}</div>}
            <button type="submit" disabled={loading} style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Procesando...' : 'Finalizar compra'}
            </button>
            <button type="button" onClick={clearCart} style={{ marginLeft: 16, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>Vaciar carrito</button>
          </form>
        </>
      )}
    </Box>
  );
}

export default Cart;