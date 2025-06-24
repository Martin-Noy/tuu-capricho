import { useState } from 'react';
import { VStack, FormControl, FormLabel, Input, Button, FormHelperText } from '@chakra-ui/react';

const OrderForm = ({ isComplete, onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      // Podrías añadir un toast de error aquí
      return;
    }
    onSubmit({ name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch" p={4} borderWidth={1} borderRadius="lg" bg="white" shadow="sm">
        <FormControl isRequired>
          <FormLabel>Nombre Completo</FormLabel>
          <Input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            isDisabled={!isComplete}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Correo Electrónico</FormLabel>
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            isDisabled={!isComplete}
          />
        </FormControl>
        {!isComplete && (
            <FormHelperText textAlign="center" color="orange.500">
                Debes completar las 80 páginas para poder finalizar el pedido.
            </FormHelperText>
        )}
        <Button
          type="submit"
          colorScheme="pink"
          w="100%"
          isDisabled={!isComplete || !name || !email}
          isLoading={isLoading}
        >
          Generar mi Agenda
        </Button>
      </VStack>
    </form>
  );
};

export default OrderForm;