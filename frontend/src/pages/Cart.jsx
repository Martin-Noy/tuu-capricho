import React from 'react';
import { Heading, Box } from '@chakra-ui/react';

function Cart() {
  return (
    <Box p={8} textAlign="center">
      <Heading as="h2" size="lg">Carrito de Compras</Heading>
      <p>Aquí verás los productos que has agregado al carrito.</p>
    </Box>
  );
}

export default Cart;