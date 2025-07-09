import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      pink: '#E6A4B4',      // Rosa Principal (modificado para más contraste)
      cream: '#F3D7CA',     // Crema Suave
      yellow: '#f3e07d',    // Amarillo Pastel
      blue: '#cee0e8',      // Azul Cielo
      lightPink: '#ffecf8', // Rosa Pálido
      text: '#4A4A4A',      // Un color de texto oscuro pero suave
    },
  },
  fonts: {
    heading: `'Montserrat', sans-serif`,
    body: `'Lato', sans-serif`,
  },
  styles: {
    global: {
      // Mover esta línea al principio es la solución
      '@import': "url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@700&display=swap')",
      body: {
        bg: 'brand.bg',
        color: 'brand.text',
      },
    },
  },
});

export default theme;