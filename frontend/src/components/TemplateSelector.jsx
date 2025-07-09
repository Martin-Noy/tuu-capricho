// Archivo: TemplateSelector.jsx

import { useState } from 'react';
import {
  SimpleGrid,
  VStack,
  Box,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex
} from '@chakra-ui/react';
import { AddIcon, ViewIcon } from '@chakra-ui/icons';

const TemplateSelector = ({ sectionName, templates, dispatch }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleAdd = (template) => {
    dispatch({ type: 'ADD_ITEM', payload: { section: sectionName, template } });
    onClose();
  };

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

          //---> CAMBIO 1: Añadimos #toolbar=0 a la URL para ocultar la barra de herramientas del PDF.
          const pdfUrl = `${backendUrl}/PDFs/${sectionName}/${templateName}.pdf#toolbar=0`;

          return (
            <VStack
              key={template.id || template}
              bg="gray.50"
              borderRadius="xl"
              boxShadow="md"
              p={4}
              spacing={3}
              align="stretch"
              transition="all 0.2s"
              _hover={{
                transform: 'scale(1.03)',
                boxShadow: 'lg',
              }}
            >
              <Box
                width="100%"
                height="180px"
                border="1px solid #e2e8f0"
                borderRadius="md"
                overflow="hidden"
                bg="gray.200"
                boxShadow="inner"
                cursor="pointer"
                position="relative"
                onClick={() => handlePreview({ name: templateName, section: sectionName })}
                //---> CAMBIO 2: Deshabilitamos el clic derecho en el contenedor de la previsualización.
                onContextMenu={(e) => e.preventDefault()}
                _hover={{
                  '& .overlay': { opacity: 1 }
                }}
              >
                <iframe
                  src={pdfUrl} // Usamos la nueva URL
                  title={templateName}
                  width="100%"
                  height="180px"
                  style={{ border: "hidden", pointerEvents: "none" }}
                />
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
      
      {selectedTemplate && (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedTemplate.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/*---> CAMBIO 3: Aplicamos las mismas protecciones al iframe del Modal. */}
              <Box
                w="100%"
                h={{ base: "60vh", md: "75vh" }}
                bg="gray.100"
                onContextMenu={(e) => e.preventDefault()} // Deshabilitar clic derecho
              >
                <iframe
                  // URL con #toolbar=0
                  src={`${backendUrl}/PDFs/${selectedTemplate.section}/${selectedTemplate.name}.pdf#toolbar=0`}
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