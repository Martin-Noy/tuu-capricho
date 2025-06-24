import { Box, VStack, HStack, Text, Progress, IconButton, Heading } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import PageCounter from './PageCounter';

const AgendaPreview = ({ items, totalPages, maxPages, dispatch }) => {
  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };
  
  const progressPercent = (totalPages / maxPages) * 100;

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" bg="white" shadow="sm">
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Heading size="sm">Total de Páginas</Heading>
          <Text fontWeight="bold" color={totalPages === maxPages ? 'green.500' : 'brand.text'}>
            {totalPages} / {maxPages}
          </Text>
        </HStack>
        <Progress value={progressPercent} size="sm" colorScheme="pink" borderRadius="md" />
        
        <VStack align="stretch" spacing={3} mt={4}>
          {items.length === 0 ? (
             <Text color="gray.500" fontStyle="italic" textAlign="center">Añade secciones desde la izquierda para empezar.</Text>
          ) : (
            items.map(item => (
                <HStack key={item.id} justify="space-between" p={2} bg="gray.50" borderRadius="md">
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