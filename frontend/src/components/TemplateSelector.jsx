// Archivo: TemplateSelector.jsx

import { VStack, HStack, Text, Button, Box } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const TemplateSelector = ({ sectionName, templates, dispatch }) => {
  const handleAdd = (template) => {
    dispatch({ type: 'ADD_ITEM', payload: { section: sectionName, template } });
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  return (
    <VStack align="stretch" spacing={4} w="full">
      {templates.map((template) => {
        const templateName = template.name
          ? template.name
          : (typeof template === 'string' ? template.replace('.pdf', '') : '');

        const pdfUrl = `${backendUrl}/PDFs/${sectionName}/${templateName}.pdf`;

        return (
          // ---- CAMBIO: Se añade efecto hover y transición a toda la fila ----
          <HStack 
            key={template.id || template} 
            justify="space-between" 
            p={3} 
            bg="gray.50" 
            borderRadius="lg" // <-- Bordes más redondeados
            boxShadow="sm"
            transition="all 0.2s ease-in-out"
            _hover={{
              transform: 'scale(1.02)',
              boxShadow: 'md',
              borderColor: 'pink.400'
            }}
          >
            <Box display="flex" alignItems="center" gap={4}>
              <Box
                width="100px" // <-- Un poco más pequeño para optimizar espacio
                height="140px"
                border="1px solid #e2e8f0"
                borderRadius="md"
                overflow="hidden"
                bg="gray.200"
                boxShadow="inner"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <iframe
                  src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  title={templateName}
                  width="100"
                  height="140"
                  style={{ border: "none" }}
                  scrolling="no"
                />
              </Box>
              <Text fontWeight="bold" fontSize="md">{templateName}</Text>
            </Box>
            <Button
              size="sm"
              colorScheme="pink"
              variant="solid"
              onClick={() => handleAdd(template)}
              leftIcon={<AddIcon />}
              fontWeight="bold"
            >
              Añadir
            </Button>
          </HStack>
        );
      })}
    </VStack>
  );
};

export default TemplateSelector;