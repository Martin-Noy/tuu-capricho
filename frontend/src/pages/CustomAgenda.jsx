import React from 'react';
import {Box } from '@chakra-ui/react';
import AgendaBuilder from '../components/AgendaBuilder';

function CustomAgenda() {
  return (
    <Box p={8} textAlign="center">
      <AgendaBuilder />
    </Box>
  );
}

export default CustomAgenda;