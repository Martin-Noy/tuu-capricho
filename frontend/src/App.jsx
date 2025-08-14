import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Header from './components/Header';

// Importa las páginas
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import CustomAgenda from './pages/CustomAgenda';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import { Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext.jsx';
import { useCart } from './context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

function App() {
  const { user, login, logout } = useUser();
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box>
      <Header cartCount={cartCount} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:id' element={<ProductDetail />} />
        <Route path='/cart' element={<Cart />} />
        <Route path="/customAgenda" element={<CustomAgenda />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={user && user.isAdmin ? <AdminPanel /> : <Navigate to="/login" replace />} />
      </Routes>
      <a href="https://www.flaticon.com/free-icons/agenda" title="agenda icons">Agenda icons created by Freepik - Flaticon</a>
    </Box>
  );
}

export default App;