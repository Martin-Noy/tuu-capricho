import { useEffect, useReducer } from 'react';
import { Box, Container, Heading, VStack, Text, Spinner, Alert, AlertIcon, SimpleGrid, useToast } from '@chakra-ui/react';
import axios from 'axios';
import SectionPicker from './SectionPicker';
import AgendaPreview from './AgendaPreview';
import OrderForm from './OrderForm';

const MAX_PAGES = 80;

const initialState = {
  // Estructura de secciones y plantillas obtenida de la API
  availableSections: [],
  // Items que el usuario ha añadido a su agenda
  items: [], // Array de { id, section, template, pages }
  totalPages: 0,
  // Estado de la carga de datos
  loading: true,
  error: null,
  // Estado del pedido
  orderPlaced: false,
  isSubmitting: false,
};

function agendaReducer(state, action) {
  console.log("🚀 ~ agendaReducer ~ action:", JSON.stringify(action))
  
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return { ...state, availableSections: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_ITEM': {
      const { section, template } = action.payload;
      const newItem = {
        id: new Date().getTime(), // ID simple basado en el tiempo
        section,
        template,
        pages: 1, // Siempre se empieza con 1 página
      };
      const newTotalPages = state.totalPages + 1;
      if (newTotalPages > MAX_PAGES) return state; // No permitir añadir más de 80
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
          // No permitir exceder el total de páginas
          if (state.totalPages + pageDiff > MAX_PAGES) {
            return item; // No hacer cambios si se excede
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
        console.error(err);
      }
    };
    fetchSections();
  }, []);

  const handleOrderSubmit = async (customerDetails) => {
    dispatch({ type: 'SUBMIT_ORDER_START' });
    try {
        const payload = {
            agendaItems: state.items,
            customerDetails
        };
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
        console.error("Error al enviar el pedido:", error);
        toast({
            title: 'Error en el pedido.',
            description: error.response?.data?.message || "No pudimos procesar tu pedido. Inténtalo de nuevo.",
            status: 'error',
            duration: 9000,
            isClosable: true,
        });
    }
  };

  if (state.loading) {
    return <Spinner size="xl" />;
  }

  if (state.error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {state.error}
      </Alert>
    );
  }

  if(state.orderPlaced) {
    return (
        <Container maxW="container.md" centerContent py={10}>
            <VStack spacing={8}>
                <Heading>🎉 ¡Gracias por tu pedido! 🎉</Heading>
                <Text fontSize="lg">Tu agenda personalizada se está procesando. Recibirás una confirmación por correo.</Text>
            </VStack>
        </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8}>
        <Heading as="h2" size="lg">Personaliza tu Agenda</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} w="100%">
          <Box>
            <Heading as="h3" size="md" mb={4}>1. Elige tus Secciones</Heading>
            <SectionPicker sections={state.availableSections} dispatch={dispatch} />
          </Box>
          <Box>
             <Heading as="h3" size="md" mb={4}>2. Revisa tu Capricho</Heading>
            <AgendaPreview
              items={state.items}
              totalPages={state.totalPages}
              maxPages={MAX_PAGES}
              dispatch={dispatch}
            />
             <Heading as="h3" size="md" mt={8} mb={4}>3. Finaliza tu Pedido</Heading>
             <OrderForm 
                isComplete={state.totalPages === MAX_PAGES} 
                onSubmit={handleOrderSubmit}
                isLoading={state.isSubmitting}
            />
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default AgendaBuilder;