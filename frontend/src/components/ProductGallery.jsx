import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';

//TO-DO: Agregar filtros, paginación, búsqueda y vista rápida de producto.
const ProductGallery = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', margin: '2rem 0' }}>
      {products.map(product => (
        <div key={product.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p><b>${product.basePrice}</b></p>
          <p>Stock: {product.stock}</p>
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock < 1}
            style={{ padding: '8px 16px', background: '#2980b9', color: '#fff', border: 'none', borderRadius: 4, cursor: product.stock < 1 ? 'not-allowed' : 'pointer' }}
          >
            Agregar al carrito
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductGallery;
