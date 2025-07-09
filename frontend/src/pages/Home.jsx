import React from 'react';
import { Heading, Box, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Box p={8} textAlign="center">
      <Heading as="h2" size="lg">Bienvenido a Tuu Capricho</Heading>
      <p>Explora nuestros productos y personaliza tu agenda.</p>
      <Button
        mt={6}
        colorScheme="pink"
        size="lg"
        onClick={() => navigate('/customAgenda')}
      >
        Personalizar mi Agenda
      </Button>
    </Box>
  );
}

export default Home;