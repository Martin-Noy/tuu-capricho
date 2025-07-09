// Archivo: TemplateSelector.jsx

import { SimpleGrid, VStack, Box, Text, Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const TemplateSelector = ({ sectionName, templates, dispatch }) => {
  const handleAdd = (template) => {
    dispatch({ type: 'ADD_ITEM', payload: { section: sectionName, template } });
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} w="full">
      {templates.map((template) => {
        const templateName = template.name
          ? template.name
          : (typeof template === 'string' ? template.replace('.pdf', '') : '');

        const pdfUrl = `${backendUrl}/PDFs/${sectionName}/${templateName}.pdf`;

        return (
          <VStack
            key={template.id || template}
            bg="gray.50"
            borderRadius="xl"
            boxShadow="md"
            p={4}
            spacing={4}
            align="center"
            transition="all 0.2s"
            _hover={{
              transform: 'scale(1.03)',
              boxShadow: 'lg',
              borderColor: 'pink.400',
            }}
          >
            <Box
              width="140px"
              height="180px"
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
                width="130"
                height="170"
                style={{ border: "none" }}
                scrolling="no"
              />
            </Box>
            <Text fontWeight="bold" fontSize="md" textAlign="center">{templateName}</Text>
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
  );
};

export default TemplateSelector;