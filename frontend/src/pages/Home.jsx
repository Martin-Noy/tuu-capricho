import React from 'react';
import {
  Box,
  Button,
  Flex, // Usaremos Flex para centrar el contenido vertical y horizontalmente
  Heading,
  Text, // Es mejor usar el componente Text para los párrafos
  VStack, // Apilaremos los textos verticalmente para un mejor espaciado
  Image // Añadimos un componente de imagen para mayor impacto visual
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import agendaImg from '../assets/agenda.png'; // importa la imagen

function Home() {
  const navigate = useNavigate();

  return (
    // 1. Contenedor principal
    // Usamos Flex para centrar todo el contenido en la página.
    // Le damos una altura mínima del 90% de la vista (vh) y un fondo degradado.
    <Flex
      align="center"
      justify="center"
      minH="90vh"
      bgGradient="linear(to-br, pink.100, purple.100)" // Gradiente suave
      p={4} // Padding responsivo
    >
      {/* 2. Contenedor del contenido */}
      {/* VStack apila los elementos verticalmente y gestiona el espaciado */}
      <VStack spacing={6} textAlign="center" bg="whiteAlpha.800" p={10} borderRadius="lg" boxShadow="xl">
        
        {/* Puedes añadir un logo o una imagen representativa aquí */}
        <Image
          borderRadius=""
          boxSize="120px"
          src={agendaImg} // usa la variable importada
          alt="Logo Tuu Capricho"
          mb={2}
        />

        {/* 3. Títulos y texto */}
        <Heading as="h1" size="2xl" color="gray.700">
          Bienvenido a <Box as="span" color="pink.500">Tuu Capricho</Box>
        </Heading>

        <Text fontSize="xl" color="gray.600">
          Explora nuestros productos y crea la agenda de tus sueños.
        </Text>

        {/* 4. Botón de acción mejorado */}
        <Button
          mt={6}
          colorScheme="pink"
          size="lg"
          onClick={() => navigate('/customAgenda')}
          // Efecto sutil al pasar el mouse
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}
        >
          Personalizar mi Agenda
        </Button>
      </VStack>
    </Flex>
  );
}

export default Home;