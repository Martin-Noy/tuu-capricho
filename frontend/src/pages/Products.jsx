import React from 'react';
import { Heading, Box } from '@chakra-ui/react';

function Products() {
  return (
    <Box p={8} textAlign="center">
      <Heading as="h2" size="lg">Productos</Heading>
      <p>Aquí verás la lista de productos disponibles.</p>
    </Box>
  );
}

export default Products;