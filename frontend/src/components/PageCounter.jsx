import { HStack, Button, Input } from '@chakra-ui/react';

const PageCounter = ({ itemId, currentPages, dispatch }) => {
  const handleChange = (newPages) => {
    const pages = Math.max(1, newPages); // Mínimo 1 página
    dispatch({ type: 'UPDATE_PAGES', payload: { id: itemId, pages } });
  };

  return (
    <HStack maxW="120px">
      <Button onClick={() => handleChange(currentPages - 1)} size="sm">-</Button>
      <Input
        value={currentPages}
        onChange={(e) => handleChange(parseInt(e.target.value, 10) || 1)}
        size="sm"
        textAlign="center"
      />
      <Button onClick={() => handleChange(currentPages + 1)} size="sm">+</Button>
    </HStack>
  );
};

export default PageCounter;