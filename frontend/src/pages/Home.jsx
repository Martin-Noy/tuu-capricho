import React from 'react';
import { Heading, Box } from '@chakra-ui/react';

function Home() {
  return (
    <Box p={8} textAlign="center">
      <Heading as="h2" size="lg">Bienvenido a Tuu Capricho</Heading>
      <p>Explora nuestros productos y personaliza tu agenda.</p>
    </Box>
  );
}

export default Home;