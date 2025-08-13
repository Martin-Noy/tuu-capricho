// Archivo: AgendaBuilder.jsx (Modificado)

import { useEffect, useReducer } from 'react';
import { Box, Container, Heading, VStack, Text, Spinner, Alert, AlertIcon, SimpleGrid, useToast, Flex } from '@chakra-ui/react';
import axios from 'axios';
//---> 1. Importamos el nuevo componente
import CoverDesigner from './CoverDesigner';
import SectionPicker from './SectionPicker';
import AgendaPreview from './AgendaPreview';
import OrderForm from './OrderForm';

const MAX_PAGES = 80;

const initialState = {
  availableSections: [],
  items: [],
  totalPages: 0,
  loading: true,
  error: null,
  orderPlaced: false,
  isSubmitting: false,
  //---> 2. Añadimos el estado para la portada
  coverDetails: {
    title: '',
    imageUrl: '',
  },
};

function agendaReducer(state, action) {
  //---> 3. Añadimos un nuevo "case" para manejar la actualización de la portada
  switch (action.type) {
    case 'UPDATE_COVER':
      return { ...state, coverDetails: action.payload };
    
    // (El resto de los cases no cambian...)
    case 'FETCH_SUCCESS':
      return { ...state, availableSections: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_ITEM': {
      const { section, template } = action.payload;
      const newItem = {
        id: new Date().getTime(),
        section,
        template,
        pages: 1,
      };
      const newTotalPages = state.totalPages + 1;
      if (newTotalPages > MAX_PAGES) return state;
      return {
        ...state,
        items: [...state.items, newItem],
        totalPages: newTotalPages,
      };
    }
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload.id);
      if (!itemToRemove) return state;
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
        totalPages: state.totalPages - itemToRemove.pages,
      };
    }
    case 'UPDATE_PAGES': {
      let newTotalPages = state.totalPages;
      const newItems = state.items.map(item => {
        if (item.id === action.payload.id) {
          const pageDiff = action.payload.pages - item.pages;
          if (state.totalPages + pageDiff > MAX_PAGES) {
            return item;
          }
          newTotalPages += pageDiff;
          return { ...item, pages: action.payload.pages };
        }
        return item;
      });
      return { ...state, items: newItems, totalPages: newTotalPages };
    }
    case 'SUBMIT_ORDER_START':
        return { ...state, isSubmitting: true };
    case 'SUBMIT_ORDER_SUCCESS':
        return { ...state, isSubmitting: false, orderPlaced: true };
    case 'SUBMIT_ORDER_FAILURE':
        return { ...state, isSubmitting: false, error: 'Failed to place order.' };
    default:
      throw new Error(`Acción no reconocida: ${action.type}`);
  }
}

const AgendaBuilder = () => {
  const [state, dispatch] = useReducer(agendaReducer, initialState);
  const toast = useToast();

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get('/api/sections');
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      } catch (err) {
        dispatch({ type: 'FETCH_ERROR', payload: 'No se pudieron cargar las secciones.' });
      }
    };
    fetchSections();
  }, []);

  const handleOrderSubmit = async (customerDetails) => {
    dispatch({ type: 'SUBMIT_ORDER_START' });
    try {
        // Corregimos el payload para que coincida con lo que espera el backend
        const payload = {
            coverDetails: state.coverDetails,
            items: state.items, // Cambiamos agendaItems por items
            customerDetails
        };
        
        console.log('🚀 Sending payload to backend:', payload);
        await axios.post('/api/generate-agenda', payload);
        dispatch({ type: 'SUBMIT_ORDER_SUCCESS' });
        toast({
            title: '¡Pedido realizado!',
            description: "Hemos recibido tu capricho. Pronto estará listo.",
            status: 'success',
            duration: 9000,
            isClosable: true,
        });
    } catch (error) {
        dispatch({ type: 'SUBMIT_ORDER_FAILURE' });
        console.error('❌ Error submitting order:', error.response?.data);
        toast({
            title: 'Error en el pedido.',
            description: error.response?.data?.message || "No pudimos procesar tu pedido.",
            status: 'error',
            duration: 9000,
            isClosable: true,
        });
    }
  };

  if (state.loading) return <Spinner size="xl" />;
  if (state.error) return <Alert status="error"><AlertIcon />{state.error}</Alert>;
  if (state.orderPlaced) {
      return (
        <Container maxW="container.md" centerContent py={10}>
            <VStack spacing={8}>
                <Heading>🎉 ¡Gracias por tu pedido! 🎉</Heading>
                <Text fontSize="lg">Tu agenda personalizada está en camino. Revisa tu correo.</Text>
            </VStack>
        </Container>
      )
  }

  //---> 5. Reestructuramos el layout para añadir el nuevo paso
  return (
    <Box bgGradient="linear(to-br, pink.50, purple.50)" py={{ base: 8, md: 12 }}>
      <Container maxW="container.xl">
        <VStack spacing={4} mb={10}>
          <Heading as="h1" size="xl" color="gray.700">Personaliza tu Agenda</Heading>
          <Text color="gray.600">Sigue los pasos para crear la agenda de tus sueños.</Text>
        </VStack>
        
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ base: 8, md: 10 }} w="100%">
          
          {/* Columna Izquierda: Ahora tiene el diseñador de tapa Y el selector de secciones */}
          <VStack gridColumn={{ base: 'auto', lg: 'span 2' }} spacing={8} align="stretch">
            {/* Paso 1: Diseñador de Tapa */}
            <Box bg="white" p={6} borderRadius="xl" boxShadow="lg">
              <StepHeading number="1" text="Diseña tu Tapa" />
              <CoverDesigner coverDetails={state.coverDetails} dispatch={dispatch} />
            </Box>

            {/* Paso 2: Selector de Secciones */}
            <Box bg="white" p={6} borderRadius="xl" boxShadow="lg">
              <StepHeading number="2" text="Elige tus Secciones" />
              <SectionPicker sections={state.availableSections} dispatch={dispatch} />
            </Box>
          </VStack>

          {/* Columna Derecha: Sigue teniendo la vista previa y el formulario */}
          <VStack spacing={8} bg="white" p={6} borderRadius="xl" boxShadow="lg" align="stretch" position="sticky" top="2rem">
             <Box>
                {/* Ahora este es el paso 3 */}
                <StepHeading number="3" text="Revisa tu Capricho" />
                <AgendaPreview
                  items={state.items}
                  totalPages={state.totalPages}
                  maxPages={MAX_PAGES}
                  dispatch={dispatch}
                  // Pasamos los detalles de la agenda para la previsualización
                  fullAgendaDetails={{ coverDetails: state.coverDetails, items: state.items }}
                />
             </Box>
             <Box>
                {/* Y este el paso 4 */}
                <StepHeading number="4" text="Finaliza tu Pedido" />
                <OrderForm 
                    isComplete={state.totalPages === MAX_PAGES} 
                    onSubmit={handleOrderSubmit}
                    isLoading={state.isSubmitting}
                />
             </Box>
          </VStack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

// El componente de encabezado de paso no cambia
const StepHeading = ({ number, text }) => (
  <Flex align="center" mb={4}>
    <Flex bg="pink.500" color="white" borderRadius="full" w="30px" h="30px" align="center" justify="center" fontWeight="bold" mr={3}>
      {number}
    </Flex>
    <Heading as="h3" size="md">{text}</Heading>
  </Flex>
);

export default AgendaBuilder;