import { Routes, Route } from 'react-router-dom';
import { Box, Heading } from '@chakra-ui/react';

// Importa las páginas
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import CustomAgenda from './pages/CustomAgenda';

function App() {
  return (
    <Box>
      <Box bg="white" p={4} shadow="md" textAlign="center">
        <Heading as="h1" size="xl" color="brand.pink" fontFamily="heading">
          Tuu Capricho
        </Heading>
      </Box>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:id' element={<ProductDetail />} />
        <Route path='/cart' element={<Cart />} />
        <Route path="/customAgenda" element={<CustomAgenda />} />
      </Routes>
    </Box>
  );
}

export default App;