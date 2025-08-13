// Archivo: AgendaPreview.jsx (Confirmado y listo para usar)

import { useState } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Progress, 
  IconButton, 
  Heading, 
  Button, 
  useDisclosure, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  Center, 
  Spinner, 
  ModalFooter 
} from '@chakra-ui/react';
import { DeleteIcon, InfoOutlineIcon, ViewIcon } from '@chakra-ui/icons';
import PageCounter from './PageCounter';
import axios from 'axios';

const AgendaPreview = ({ items, totalPages, maxPages, dispatch, fullAgendaDetails }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };
  
  const progressPercent = (totalPages / maxPages) * 100;

  // Esta función está implementada correctamente para trabajar con el backend.
  const handlePreview = async () => {
    setIsPreviewLoading(true);
    onOpen();
    try {
      // 1. Llama al backend y le especifica que la respuesta será un 'blob'.
      const response = await axios.post('/api/preview-agenda', fullAgendaDetails, { responseType: 'blob' });
      
      // 2. Crea un objeto Blob con los datos binarios del PDF.
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      
      // 3. Genera una URL temporal en el navegador para ese Blob.
      const url = URL.createObjectURL(pdfBlob);
      setPreviewUrl(url);

    } catch (error) {
      console.error("Error generating preview:", error);
      // En caso de error, se cierra el modal para no mostrar un visor vacío.
      onClose(); 
    } finally {
      setIsPreviewLoading(false);
    }
  };


  return (
    <Box p={4} borderWidth={1} borderRadius="lg" bg="white" borderColor="gray.200" shadow="none">
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Heading size="sm">Total de Páginas</Heading>
          <Text fontWeight="bold" fontSize="lg" color={totalPages === maxPages ? 'green.500' : 'gray.700'}>
            {totalPages} / {maxPages}
          </Text>
        </HStack>
        <Progress value={progressPercent} size="sm" colorScheme={progressPercent < 100 ? 'pink' : 'green'} borderRadius="md" />
        
        <VStack align="stretch" spacing={3} mt={2} maxH="250px" overflowY="auto" pr={2}>
          {items.length === 0 ? (
            <VStack py={8} spacing={4} color="gray.400" textAlign="center">
                <InfoOutlineIcon boxSize="24px" />
                <Text fontStyle="italic">Tu agenda está vacía.</Text>
            </VStack>
          ) : (
            items.map(item => (
                <HStack key={item.id} justify="space-between" p={3} bg="gray.100" borderRadius="md">
                    <Box>
                        <Text fontWeight="bold">{item.section}</Text>
                        <Text fontSize="sm" color="gray.600">{item.template.name ? item.template.name : item.template.replace('.pdf', '')}</Text>
                    </Box>
                    <HStack>
                        <PageCounter itemId={item.id} currentPages={item.pages} dispatch={dispatch} />
                        <IconButton aria-label="Eliminar" icon={<DeleteIcon />} colorScheme="red" variant="ghost" size="sm" onClick={() => handleRemove(item.id)} />
                    </HStack>
                </HStack>
            ))
          )}
        </VStack>

        <Button 
          mt={4} 
          colorScheme="purple" 
          leftIcon={<ViewIcon />}
          onClick={handlePreview}
          isDisabled={items.length === 0}
        >
          Previsualizar Agenda Completa
        </Button>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Previsualización de tu Agenda</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center h={{ base: "60vh", md: "75vh" }} bg="gray.100" onContextMenu={(e) => e.preventDefault()}>
              {isPreviewLoading ? (
                <VStack>
                  <Spinner size="xl" />
                  <Text mt={4}>Generando tu capricho...</Text>
                </VStack>
              ) : (
                <iframe
                  // 4. Se usa la URL del blob y se oculta la barra de herramientas del PDF.
                  src={`${previewUrl}#toolbar=0`}
                  title="Preview de la Agenda Completa"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                />
              )}
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AgendaPreview;