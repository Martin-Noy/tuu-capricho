import { VStack, HStack, Text, Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const TemplateSelector = ({ sectionName, templates, dispatch }) => {
  const handleAdd = (template) => {
    dispatch({ type: 'ADD_ITEM', payload: { section: sectionName, template } });
  };

  return (
    <VStack align="stretch" spacing={2}>
      {templates.map((template) => (
        <HStack key={template} justify="space-between" p={2} bg="gray.50" borderRadius="md">
          <Text>{template.replace('.pdf', '')}</Text>
          <Button
            size="sm"
            colorScheme="pink"
            variant="ghost"
            onClick={() => handleAdd(template)}
            leftIcon={<AddIcon />}
          >
            Añadir
          </Button>
        </HStack>
      ))}
    </VStack>
  );
};

export default TemplateSelector;