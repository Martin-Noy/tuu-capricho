import { VStack, HStack, Text, Button, Box } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const TemplateSelector = ({ sectionName, templates, dispatch }) => {
  const handleAdd = (template) => {
    dispatch({ type: 'ADD_ITEM', payload: { section: sectionName, template } });
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  return (
    <VStack align="stretch" spacing={4} p={2} bg="white" borderRadius="md" boxShadow="md" w="full">
      {templates.map((template) => {
        const templateName = template.name
          ? template.name
          : (typeof template === 'string' ? template.replace('.pdf', '') : '');

        // Ruta al PDF
        const pdfUrl = `${backendUrl}/PDFs/${sectionName}/${templateName}.pdf`;

        return (
          <HStack key={template.id || template} justify="space-between" p={3} bg="gray.50" borderRadius="md" boxShadow="sm">
            <Box display="flex" alignItems="center" gap={4}>
              {/* Preview del PDF */}
              <Box
                width="140px"
                height="180px"
                border="1px solid #ddd"
                borderRadius="lg"
                overflow="hidden"
                bg="gray.100"
                boxShadow="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <iframe
                  src={pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0"}
                  title={templateName}
                  width="130"
                  height="170"
                  style={{ border: "none" }}
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