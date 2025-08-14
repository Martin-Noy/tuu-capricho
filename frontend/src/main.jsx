import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import theme from './theme.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <ChakraProvider theme={theme}>
            <App />
          </ChakraProvider>
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)