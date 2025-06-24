import { Routes, Route } from 'react-router-dom';
import { Box, Heading } from '@chakra-ui/react';
import AgendaBuilder from './components/AgendaBuilder';

function App() {
  return (
    <Box>
      <Box bg="white" p={4} shadow="md" textAlign="center">
        <Heading as="h1" size="xl" color="brand.pink" fontFamily="heading">
          Tuu Capricho
        </Heading>
      </Box>
      <Routes>
        <Route path="/" element={<AgendaBuilder />} />
        {/* En el futuro, se pueden añadir más rutas aquí */}
        {/* <Route path="/landing" element={<LandingPage />} /> */}
      </Routes>
    </Box>
  );
}

export default App;