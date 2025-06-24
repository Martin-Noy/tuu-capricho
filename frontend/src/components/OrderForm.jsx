import { useState } from 'react';
import { VStack, FormControl, FormLabel, Input, Button, Text, Box } from '@chakra-ui/react';

const OrderForm = ({ isComplete, onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      return;
    }
    onSubmit({ name, email });
  };

  return (
    <Box p={5} borderWidth={1} borderRadius="lg" bg="white" shadow="md">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired isDisabled={!isComplete}>
            <FormLabel>Nombre Completo</FormLabel>
            <Input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired isDisabled={!isComplete}>
            <FormLabel>Correo Electrónico</FormLabel>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          
          {/* ---- ESTA ES LA PARTE CORREGIDA ---- */}
          {!isComplete && (
            <Text textAlign="center" color="orange.500" fontSize="sm">
                Debes tener exactamente 80 páginas para poder finalizar el pedido.
            </Text>
          )}
          {/* ---- FIN DE LA CORRECCIÓN ---- */}

          <Button
            type="submit"
            colorScheme="pink"
            size="lg"
            w="100%"
            isDisabled={!isComplete || !name || !email}
            isLoading={isLoading}
          >
            Generar mi Agenda
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default OrderForm;