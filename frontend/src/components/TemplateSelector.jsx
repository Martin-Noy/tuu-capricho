// Archivo: TemplateSelector.jsx

import { useState } from 'react';
import { 
  SimpleGrid, 
  VStack, 
  Box, 
  Text, 
  Button,
  // --- INICIO DE CAMBIOS ---
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Icon,
  Flex
  // --- FIN DE CAMBIOS ---
} from '@chakra-ui/react';
import { AddIcon, ViewIcon } from '@chakra-ui/icons'; // Importamos un nuevo ícono

const TemplateSelector = ({ sectionName, templates, dispatch }) => {
  // ---- CAMBIO: Hook para controlar el estado del Modal (abierto/cerrado) ----
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ---- CAMBIO: Estado para saber qué plantilla estamos viendo en el Modal ----
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleAdd = (template) => {
    dispatch({ type: 'ADD_ITEM', payload: { section: sectionName, template } });
    onClose(); // Cerramos el modal si se añade desde ahí
  };

  // ---- CAMBIO: Función para abrir el modal con la plantilla correcta ----
  const handlePreview = (template) => {
    setSelectedTemplate(template);
    onOpen();
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  return (
    <>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} w="full">
        {templates.map((template) => {
          const templateName = template.name
            ? template.name
            : (typeof template === 'string' ? template.replace('.pdf', '') : '');

          return (
            // Se mantiene la tarjeta principal
            <VStack
              key={template.id || template}
              bg="gray.50"
              borderRadius="xl"
              boxShadow="md"
              p={4}
              spacing={3} // Un poco menos de espaciado
              align="stretch" // Alineamos los hijos para que ocupen todo el ancho
              transition="all 0.2s"
              _hover={{
                transform: 'scale(1.03)',
                boxShadow: 'lg',
              }}
            >
              {/* ---- CAMBIO: La imagen ahora abre el Modal ---- */}
              <Box
                width="100%" // Ocupa todo el ancho de la tarjeta
                height="180px"
                border="1px solid #e2e8f0"
                borderRadius="md"
                overflow="hidden"
                bg="gray.200"
                boxShadow="inner"
                cursor="pointer" // Cambiamos el cursor para indicar que es clickeable
                position="relative" // Necesario para posicionar el ícono de "ver"
                onClick={() => handlePreview({ name: templateName, section: sectionName })}
                // Efecto de overlay para indicar la acción
                _hover={{
                  '& .overlay': { opacity: 1 }
                }}
              >
                <iframe
                  src={`${backendUrl}/PDFs/${sectionName}/${templateName}.pdf#toolbar=0&navpanes=0&scrollbar=0`}
                  title={templateName}
                  width="100%"
                  height="180px"
                  style={{ border: "hidden", pointerEvents: "none" }} // 'pointerEvents: none' para que el click pase al Box
                />
                {/* Overlay que aparece al pasar el mouse */}
                <Flex
                  className="overlay"
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="blackAlpha.600"
                  align="center"
                  justify="center"
                  color="white"
                  opacity="0"
                  transition="opacity 0.2s"
                >
                  <ViewIcon w={8} h={8} />
                </Flex>
              </Box>

              <Text fontWeight="bold" fontSize="md" textAlign="center" noOfLines={1}>
                {templateName}
              </Text>

              {/* Mantenemos el botón de añadir para acciones rápidas */}
              <Button
                size="sm"
                colorScheme="pink"
                variant="solid"
                onClick={() => handleAdd(template)}
                leftIcon={<AddIcon />}
                fontWeight="bold"
                w="full"
              >
                Añadir
              </Button>
            </VStack>
          );
        })}
      </SimpleGrid>

      {/* ---- CAMBIO: MODAL DE PREVISUALIZACIÓN ---- */}
      {/* Se renderiza solo cuando hay una plantilla seleccionada */}
      {selectedTemplate && (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedTemplate.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box w="100%" h={{ base: "60vh", md: "75vh" }} bg="gray.100">
                <iframe
                  src={`${backendUrl}/PDFs/${selectedTemplate.section}/${selectedTemplate.name}.pdf`}
                  title={`Preview of ${selectedTemplate.name}`}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                />
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cerrar
              </Button>
              <Button
                colorScheme="pink"
                leftIcon={<AddIcon />}
                onClick={() => handleAdd(selectedTemplate)}
              >
                Añadir a mi Agenda
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default TemplateSelector;