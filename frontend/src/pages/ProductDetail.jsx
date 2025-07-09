import React from 'react';
import { useParams } from 'react-router-dom';
import { Heading, Box } from '@chakra-ui/react';

function ProductDetail() {
  const { id } = useParams();

  return (
    <Box p={8} textAlign="center">
      <Heading as="h2" size="lg">Detalle del Producto</Heading>
      <p>Mostrando detalles para el producto con ID: {id}</p>
    </Box>
  );
}

export default ProductDetail;