// ---> ARCHIVO NUEVO: src/components/CoverDesigner.jsx

import { VStack, FormControl, FormLabel, Input, Box, Text, Center } from '@chakra-ui/react';

const CoverDesigner = ({ coverDetails, dispatch }) => {
  
  //---> Función para actualizar el estado de la portada en el componente padre (AgendaBuilder)
  const handleCoverChange = (field, value) => {
    dispatch({ type: 'UPDATE_COVER', payload: { ...coverDetails, [field]: value } });
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Input para el título de la portada */}
      <FormControl>
        <FormLabel fontWeight="bold">Título de la Portada</FormLabel>
        <Input
          placeholder="Ej: Mi Agenda 2025, Mis Sueños..."
          value={coverDetails.title || ''}
          onChange={(e) => handleCoverChange('title', e.target.value)}
        />
      </FormControl>

      {/* Input para la URL de la imagen de portada */}
      <FormControl>
        <FormLabel fontWeight="bold">URL de la Imagen de Portada</FormLabel>
        <Input
          placeholder="Pega aquí la URL de una imagen (ej: de Unsplash, Pexels...)"
          value={coverDetails.imageUrl || ''}
          onChange={(e) => handleCoverChange('imageUrl', e.target.value)}
        />
      </FormControl>

      {/* Vista previa en tiempo real de la portada */}
      <Box mt={4}>
        <Text mb={2} fontWeight="bold" color="gray.600">Vista Previa:</Text>
        <Center
          h="280px"
          w="100%"
          bg="gray.100"
          borderRadius="md"
          boxShadow="inner"
          p={4}
          //---> La imagen se aplica como fondo del contenedor
          bgImage={`url(${coverDetails.imageUrl})`}
          bgSize="cover"
          bgPosition="center"
          position="relative"
          color="white" // Color del texto por defecto, para que contraste
        >
          {/* Capa semitransparente para mejorar la legibilidad del texto */}
          <Box position="absolute" top="0" left="0" right="0" bottom="0" bg="blackAlpha.400" borderRadius="md" />
          
          {/* Muestra un placeholder si no hay imagen o título */}
          {!coverDetails.imageUrl && !coverDetails.title && (
            <Text position="relative" zIndex={1} color="gray.500">La vista previa aparecerá aquí</Text>
          )}

          {/* Muestra el título sobre la imagen */}
          {coverDetails.title && (
            <Text
              position="relative"
              zIndex={1}
              fontSize="3xl"
              fontWeight="bold"
              textAlign="center"
              textShadow="1px 1px 3px black"
            >
              {coverDetails.title}
            </Text>
          )}
        </Center>
      </Box>
    </VStack>
  );
};

export default CoverDesigner;