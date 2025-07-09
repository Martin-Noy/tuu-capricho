// Archivo: AgendaPreview.jsx

import { Box, VStack, HStack, Text, Progress, IconButton, Heading } from '@chakra-ui/react';
import { DeleteIcon, InfoOutlineIcon } from '@chakra-ui/icons'; // <-- Importamos otro ícono
import PageCounter from './PageCounter';

const AgendaPreview = ({ items, totalPages, maxPages, dispatch }) => {
  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };
  
  const progressPercent = (totalPages / maxPages) * 100;

  return (
    // ---- CAMBIO: Se ajusta el estilo del contenedor ----
    <Box p={4} borderWidth={1} borderRadius="lg" bg="white" borderColor="gray.200" shadow="none">
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Heading size="sm">Total de Carillas</Heading>
          <Text fontWeight="bold" fontSize="lg" color={totalPages === maxPages ? 'green.500' : 'gray.700'}>
            {totalPages} / {maxPages}
          </Text>
        </HStack>
        <Progress value={progressPercent} size="sm" colorScheme={progressPercent < 100 ? 'pink' : 'green'} borderRadius="md" />
        
        <VStack align="stretch" spacing={3} mt={4} maxH="300px" overflowY="auto" pr={2}>
          {items.length === 0 ? (
            // ---- CAMBIO: Mejoramos el texto de "estado vacío" ----
            <VStack py={8} spacing={4} color="gray.400" textAlign="center">
                <InfoOutlineIcon boxSize="24px" />
                <Text fontStyle="italic">Tu agenda está vacía.</Text>
                <Text fontSize="sm">Añade secciones desde la izquierda para empezar.</Text>
            </VStack>
          ) : (
            items.map(item => (
                <HStack key={item.id} justify="space-between" p={3} bg="gray.100" borderRadius="md">
                    <Box>
                        <Text fontWeight="bold">{item.section}</Text>
                        <Text fontSize="sm" color="gray.600">{item.template.replace('.pdf', '')}</Text>
                    </Box>
                    <HStack>
                        <PageCounter itemId={item.id} currentPages={item.pages} dispatch={dispatch} />
                        <IconButton
                            aria-label="Eliminar sección"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(item.id)}
                        />
                    </HStack>
                </HStack>
            ))
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default AgendaPreview;