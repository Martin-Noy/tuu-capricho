Claro, aquí tienes la guía completa y detallada para generar el proyecto "Tuu Capricho" desde cero. Sigue cada paso cuidadosamente, creando las carpetas y archivos exactamente como se indica.

### **Introducción**

Esta guía te permitirá construir y ejecutar una aplicación web completa para personalizar agendas. El sistema está diseñado para que las opciones de personalización se lean directamente de una estructura de carpetas que tú mismo crearás. Seguirás los pasos de un desarrollador senior para ensamblar el proyecto usando tecnologías modernas como React, Node.js y Docker. Al final, tendrás una aplicación funcional sin haber escrito una sola línea de código, solo siguiendo estas instrucciones.

-----

### **1. Estructura de Carpetas Inicial**

Antes de crear cualquier archivo, necesitas preparar la estructura de directorios del proyecto. Abre tu terminal o explorador de archivos y crea las siguientes carpetas:

```sh
tuu-capricho-project/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── services/
├── db/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       └── assets/
└── PDFs/
    ├── Notas/
    └── Planificador Semanal/
```

-----

### **2. Archivos de Configuración Global**

Estos archivos van en la raíz de tu proyecto (`tuu-capricho-project/`).

#### **Ruta del archivo:** `.env`

**Explicación:** Este archivo guarda las contraseñas y configuraciones sensibles para que no estén expuestas en el código. Docker las leerá para configurar los servicios.
**Código:**

```.env
# PostgreSQL Database Configuration
POSTGRES_DB=tuucapricho_db
POSTGRES_USER=tuucapricho_user
POSTGRES_PASSWORD=your_strong_password_here

# Backend Server Configuration
BACKEND_PORT=8000

# Frontend Server Configuration
FRONTEND_PORT=5173
```

> **Nota Importante:** Reemplaza `your_strong_password_here` con una contraseña segura de tu elección.

#### **Ruta del archivo:** `docker-compose.yml`

**Explicación:** Es el archivo principal de orquestación. Define todos los servicios (frontend, backend, base de datos), cómo se construyen y cómo se comunican entre sí.
**Código:**

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: tuu-capricho-db
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  server:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: tuu-capricho-server
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "${BACKEND_PORT}:${BACKEND_PORT}"
    volumes:
      - ./backend:/usr/src/app
      - ./PDFs:/usr/src/app/PDFs
      - ./generated-agendas:/usr/src/app/generated-agendas
      - /usr/src/app/node_modules
    depends_on:
      db:
        condition: service_healthy
    command: npm run dev

  client:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: tuu-capricho-client
    restart: unless-stopped
    ports:
      - "${FRONTEND_PORT}:${FRONTEND_PORT}"
    volumes:
      - ./frontend:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      - server
    command: npm run dev

volumes:
  postgres-data:
```

-----

### **3. Archivos del Backend (`backend/`)**

Ahora, poblaremos la carpeta `backend`.

#### **Ruta del archivo:** `backend/package.json`

**Explicación:** Define los metadatos del proyecto de Node.js y sus dependencias, como Express para el servidor y `pdf-lib` para manipular PDFs.
**Código:**

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Server for Tuu Capricho",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "@sequelize/postgres": "^7.0.0-alpha.41",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "pdf-lib": "^1.17.1",
    "pg": "^8.12.0",
    "sequelize": "^6.37.3",
    "uuid": "^10.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

#### **Ruta del archivo:** `backend/Dockerfile`

**Explicación:** Instrucciones para que Docker construya la imagen del servidor. Instala Node.js, las dependencias y prepara la aplicación para ejecutarse.
**Código:**

```dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

# El comando se pasa desde docker-compose.yml
# CMD ["npm", "run", "dev"]
```

#### **Ruta del archivo:** `backend/server.js`

**Explicación:** Punto de entrada principal del backend. Inicia el servidor Express, configura CORS, conecta a la base de datos y define las rutas de la API.
**Código:**

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import agendaRoutes from './routes/agendaRoutes.js';
import Order from './models/order.js';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', agendaRoutes);

// Database connection
const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection has been established successfully.');
    
    // Sincronizar modelos con la base de datos
    await Order.sync({ alter: true }); // 'alter: true' puede modificar la tabla si el modelo cambia
    console.log("The 'pedidos' table has been successfully synced.");

    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Salir si no se puede conectar a la BD
  }
};

connectToDb();
```

#### **Ruta del archivo:** `backend/config/database.js`

**Explicación:** Configura la conexión a la base de datos PostgreSQL usando Sequelize, leyendo las credenciales del archivo `.env`.
**Código:**

```javascript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: 'db', // El nombre del servicio de la BD en docker-compose.yml
    dialect: 'postgres',
    dialectModule: (await import('pg')).default,
    logging: false, // Poner en `console.log` para ver las queries SQL
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;
```

#### **Ruta del archivo:** `backend/models/order.js`

**Explicación:** Define la estructura (modelo) de la tabla `pedidos` para Sequelize, incluyendo la importante columna `agendaDefinition` de tipo `JSONB`.
**Código:**

```javascript
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Order extends Model {}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_name'
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_email'
  },
  generatedPdfFilename: {
    type: DataTypes.STRING,
    field: 'generated_pdf_filename'
  },
  agendaDefinition: {
    type: DataTypes.JSONB, // Usar JSONB para eficiencia en consultas
    allowNull: true,
    field: 'agenda_definition'
  },
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'pedidos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Order;
```

#### **Ruta del archivo:** `backend/routes/agendaRoutes.js`

**Explicación:** Define las rutas específicas de la API: una para obtener las secciones (`/sections`) y otra para generar la agenda (`/generate-agenda`).
**Código:**

```javascript
import express from 'express';
import { getAvailableSections, createPersonalizedAgenda } from '../controllers/agendaController.js';

const router = express.Router();

// Ruta para obtener la estructura de personalización
// GET /api/sections
router.get('/sections', getAvailableSections);

// Ruta para generar el PDF de la agenda y crear el pedido
// POST /api/generate-agenda
router.post('/generate-agenda', createPersonalizedAgenda);

export default router;
```

#### **Ruta del archivo:** `backend/controllers/agendaController.js`

**Explicación:** Es el "controlador de tráfico" de las peticiones. Llama a los servicios correspondientes para realizar el trabajo y envía la respuesta al cliente.
**Código:**

```javascript
import { getAgendaStructure } from '../services/fileService.js';
import { assemblePdf, saveOrder } from '../services/pdfService.js';

export const getAvailableSections = async (req, res) => {
  try {
    const structure = await getAgendaStructure();
    res.status(200).json(structure);
  } catch (error) {
    console.error('Error in getAvailableSections controller:', error);
    res.status(500).json({ message: 'Failed to retrieve agenda sections.' });
  }
};

export const createPersonalizedAgenda = async (req, res) => {
  const { agendaItems, customerDetails } = req.body;

  if (!agendaItems || !customerDetails || !Array.isArray(agendaItems)) {
    return res.status(400).json({ message: 'Invalid request body.' });
  }
  
  // Validación del total de páginas (ej: 80)
  const totalPages = agendaItems.reduce((sum, item) => sum + item.pages, 0);
  if (totalPages !== 80) {
      return res.status(400).json({ message: `Total pages must be exactly 80, but got ${totalPages}.` });
  }

  try {
    // 1. Ensamblar el PDF
    const pdfFilename = await assemblePdf(agendaItems);

    // 2. Guardar el pedido en la base de datos
    const orderData = {
      customerDetails,
      agendaItems,
      pdfFilename,
    };
    const newOrder = await saveOrder(orderData);
    
    // 3. Enviar respuesta exitosa
    res.status(201).json({ 
      message: 'Agenda created and order placed successfully!',
      orderId: newOrder.id,
      fileName: pdfFilename,
    });
  } catch (error) {
    console.error('Error in createPersonalizedAgenda controller:', error);
    res.status(500).json({ message: 'Failed to create personalized agenda.' });
  }
};
```

#### **Ruta del archivo:** `backend/services/fileService.js`

**Explicación:** Contiene la lógica para escanear el directorio `PDFs/`. Es el corazón de la funcionalidad dinámica.
**Código:**

```javascript
import { opendir } from 'fs/promises';
import path from 'path';

/**
 * Escanea el directorio raíz de PDFs para construir una estructura de secciones y plantillas.
 * @returns {Promise<Array<{name: string, templates: Array<{name: string, previewUrl: string}>>}>}
 */
export async function getAgendaStructure() {
  const pdfsRoot = path.resolve(process.cwd(), 'PDFs');
  const sections = [];

  try {
    const dir = await opendir(pdfsRoot);
    for await (const dirent of dir) {
      // Cada subdirectorio es una "Sección"
      if (dirent.isDirectory()) {
        const sectionName = dirent.name;
        const sectionPath = path.join(pdfsRoot, sectionName);
        const templates = [];
        const sectionDir = await opendir(sectionPath);

        for await (const templateFile of sectionDir) {
          // Cada archivo .pdf es una "Plantilla"
          if (templateFile.isFile() && path.extname(templateFile.name).toLowerCase() === '.pdf') {
            templates.push(templateFile.name);
          }
        }

        // Solo añadir la sección si contiene plantillas válidas
        if (templates.length > 0) {
          sections.push({ name: sectionName, templates });
        }
      }
    }
    return sections;
  } catch (error) {
    console.error('Error scanning PDF directory:', error);
    // Devolver un array vacío o lanzar un error para que el controlador lo maneje
    return [];
  }
}
```

#### **Ruta del archivo:** `backend/services/pdfService.js`

**Explicación:** La magia ocurre aquí. Usa `pdf-lib` para tomar las plantillas PDF, copiar sus páginas según la configuración del usuario, unirlas en un nuevo archivo y guardar el pedido en la base de datos.
**Código:**

```javascript
import { PDFDocument } from 'pdf-lib';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Order from '../models/order.js';

/**
 * Ensambla un único PDF a partir de una lista de plantillas y páginas.
 * @param {Array<{section: string, template: string, pages: number}>} agendaItems
 * @returns {Promise<string>} El nombre del archivo PDF generado.
 */
export async function assemblePdf(agendaItems) {
  const finalPdfDoc = await PDFDocument.create();

  for (const item of agendaItems) {
    const templatePath = path.resolve(process.cwd(), 'PDFs', item.section, item.template);

    // Validar que la ruta no salga del directorio PDFs (Seguridad: Path Traversal)
    const safeBaseDir = path.resolve(process.cwd(), 'PDFs');
    if (!templatePath.startsWith(safeBaseDir)) {
        throw new Error(`Security violation: Invalid path ${item.template}`);
    }

    const templateBytes = await fs.readFile(templatePath);
    const templateDoc = await PDFDocument.load(templateBytes);
    
    // Asumimos que cada plantilla es un documento de una sola página que debe ser repetida.
    // Copiamos la primera página (índice 0) de la plantilla.
    const [templatePage] = await finalPdfDoc.copyPages(templateDoc, [0]);

    for (let i = 0; i < item.pages; i++) {
      finalPdfDoc.addPage(templatePage);
    }
  }

  const pdfBytes = await finalPdfDoc.save();
  const outputDir = path.resolve(process.cwd(), 'generated-agendas');
  await fs.mkdir(outputDir, { recursive: true });

  const filename = `agenda-${uuidv4()}.pdf`;
  const outputPath = path.join(outputDir, filename);
  await fs.writeFile(outputPath, pdfBytes);

  return filename;
}

/**
 * Guarda el registro del pedido en la base de datos.
 * @param {object} orderData
 * @returns {Promise<object>} El objeto del pedido creado.
 */
export async function saveOrder(orderData) {
  const { customerDetails, agendaItems, pdfFilename } = orderData;
  
  try {
    const newOrder = await Order.create({
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      generatedPdfFilename: pdfFilename,
      agendaDefinition: agendaItems, // Sequelize se encarga de serializar a JSONB
    });
    return newOrder;
  } catch (error) {
    console.error("Error saving order to database:", error);
    throw error;
  }
}
```

-----

### **4. Archivos del Frontend (`frontend/`)**

Ahora, crearemos la interfaz de usuario en la carpeta `frontend`.

#### **Ruta del archivo:** `frontend/package.json`

**Explicación:** Define las dependencias para el proyecto de React, incluyendo Chakra UI para los componentes visuales y Axios para las llamadas a la API.
**Código:**

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@chakra-ui/icons": "^2.1.1",
    "@chakra-ui/react": "^2.8.2",
    "@emotion/react": "^11.11.4",
    "@emotion/styled": "^11.11.5",
    "axios": "^1.7.2",
    "framer-motion": "^11.2.10",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.23.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "vite": "^5.2.0"
  }
}
```

#### **Ruta del archivo:** `frontend/Dockerfile`

**Explicación:** Instrucciones para que Docker construya la imagen de la interfaz de usuario. Instala dependencias y ejecuta el servidor de desarrollo de Vite.
**Código:**

```dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# El puerto 5173 es el default de Vite
EXPOSE 5173

# El comando se pasa desde docker-compose.yml
# CMD ["npm", "run", "dev"]
```

#### **Ruta del archivo:** `frontend/vite.config.js`

**Explicación:** Archivo de configuración para Vite. Lo más importante aquí es el `proxy`, que redirige las llamadas a `/api` desde el frontend al backend, evitando problemas de CORS en desarrollo.
**Código:**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Habilitar el polling es necesario para que el hot-reloading funcione correctamente dentro de Docker
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://server:8000', // Apunta al servicio 'server' de Docker en el puerto 8000
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

#### **Ruta del archivo:** `frontend/index.html`

**Explicación:** El punto de entrada HTML de la aplicación. React se montará en el `div` con `id="root"`.
**Código:**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF--8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tuu Capricho - Personaliza tu Agenda</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### **Ruta del archivo:** `frontend/src/main.jsx`

**Explicación:** El punto de entrada de la aplicación React. Aquí se configura el `ChakraProvider` para aplicar el tema visual y el `BrowserRouter` para gestionar las rutas.
**Código:**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import theme from './theme.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

#### **Ruta del archivo:** `frontend/src/theme.js`

**Explicación:** Define la paleta de colores y las tipografías de la marca "Tuu Capricho" para que Chakra UI los use en toda la aplicación, garantizando una identidad visual consistente.
**Código:**

```javascript
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
      body: {
        bg: 'brand.cream',
        color: 'brand.text',
      },
      // Importar fuentes de Google Fonts
      '@import': "url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@700&display=swap')",
    },
  },
});

export default theme;
```

#### **Ruta del archivo:** `frontend/src/App.jsx`

**Explicación:** Componente principal que contiene el enrutador. Define las diferentes "páginas" de la aplicación. Por ahora, solo tenemos la página de personalización.
**Código:**

```jsx
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
```

#### **Ruta del archivo:** `frontend/src/components/AgendaBuilder.jsx`

**Explicación:** Este es el componente más importante del frontend. Es el "cerebro" que orquesta todo: obtiene los datos de la API, maneja el estado complejo de la personalización con `useReducer` y renderiza los demás componentes.
**Código:**

```jsx
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
```

#### **Ruta del archivo:** `frontend/src/components/SectionPicker.jsx`

**Explicación:** Muestra las secciones disponibles (como "Notas") en forma de acordeón. Dentro de cada sección, renderiza el `TemplateSelector`.
**Código:**

```jsx
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, Heading } from '@chakra-ui/react';
import TemplateSelector from './TemplateSelector';

const SectionPicker = ({ sections, dispatch }) => {
  return (
    <Accordion allowMultiple>
      {sections.map((section) => (
        <AccordionItem key={section.name}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Heading size="sm">{section.name}</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <TemplateSelector sectionName={section.name} templates={section.templates} dispatch={dispatch} />
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default SectionPicker;
```

#### **Ruta del archivo:** `frontend/src/components/TemplateSelector.jsx`

**Explicación:** Muestra las plantillas disponibles para una sección (ej: "Notas-Rayadas.pdf"). Un botón al lado de cada una permite añadirla a la agenda.
**Código:**

```jsx
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
```

#### **Ruta del archivo:** `frontend/src/components/AgendaPreview.jsx`

**Explicación:** Muestra un resumen en tiempo real de la agenda que el usuario está creando: la lista de secciones añadidas, sus páginas y el contador total.
**Código:**

```jsx
import { Box, VStack, HStack, Text, Progress, IconButton, Heading } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import PageCounter from './PageCounter';

const AgendaPreview = ({ items, totalPages, maxPages, dispatch }) => {
  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };
  
  const progressPercent = (totalPages / maxPages) * 100;

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" bg="white" shadow="sm">
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Heading size="sm">Total de Páginas</Heading>
          <Text fontWeight="bold" color={totalPages === maxPages ? 'green.500' : 'brand.text'}>
            {totalPages} / {maxPages}
          </Text>
        </HStack>
        <Progress value={progressPercent} size="sm" colorScheme="pink" borderRadius="md" />
        
        <VStack align="stretch" spacing={3} mt={4}>
          {items.length === 0 ? (
             <Text color="gray.500" fontStyle="italic" textAlign="center">Añade secciones desde la izquierda para empezar.</Text>
          ) : (
            items.map(item => (
                <HStack key={item.id} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                    <Box>
                        <Text fontWeight="bold">{item.section}</Text>
                        <Text fontSize="sm" color="gray.600">{item.template.replace('.pdf', '')}</Text>
                    </Box>
                    <HStack>
                        <PageCounter itemId={item.id} currentPages={item.pages} dispatch={dispatch} />
                        <IconButton
                            aria-label="Eliminar sección"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(item.id)}
                        />
                    </HStack>
                </HStack>
            ))
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default AgendaPreview;
```

#### **Ruta del archivo:** `frontend/src/components/PageCounter.jsx`

**Explicación:** Un componente de input numérico con botones de `+` y `-` para que el usuario defina cuántas páginas quiere de cada plantilla.
**Código:**

```jsx
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
```

#### **Ruta del archivo:** `frontend/src/components/OrderForm.jsx`

**Explicación:** Un formulario que aparece cuando el usuario completa las 80 páginas. Pide los datos del cliente y envía toda la información al backend.
**Código:**

```jsx
import { useState } from 'react';
import { VStack, FormControl, FormLabel, Input, Button, FormHelperText } from '@chakra-ui/react';

const OrderForm = ({ isComplete, onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      // Podrías añadir un toast de error aquí
      return;
    }
    onSubmit({ name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch" p={4} borderWidth={1} borderRadius="lg" bg="white" shadow="sm">
        <FormControl isRequired>
          <FormLabel>Nombre Completo</FormLabel>
          <Input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            isDisabled={!isComplete}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Correo Electrónico</FormLabel>
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            isDisabled={!isComplete}
          />
        </FormControl>
        {!isComplete && (
            <FormHelperText textAlign="center" color="orange.500">
                Debes completar las 80 páginas para poder finalizar el pedido.
            </FormHelperText>
        )}
        <Button
          type="submit"
          colorScheme="pink"
          w="100%"
          isDisabled={!isComplete || !name || !email}
          isLoading={isLoading}
        >
          Generar mi Agenda
        </Button>
      </VStack>
    </form>
  );
};

export default OrderForm;
```

-----

### **5. Archivos de Base de Datos (`db/`)**

#### **Ruta del archivo:** `db/init.sql`

**Explicación:** Script SQL que se ejecuta automáticamente la primera vez que se levanta el contenedor de la base de datos. Crea la tabla `pedidos` con la estructura correcta.
**Código:**

```sql
-- Este script se ejecuta al iniciar el contenedor de la base de datos por primera vez.
-- Crea la tabla 'pedidos' si no existe.

CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    generated_pdf_filename VARCHAR(255),
    agenda_definition JSONB, -- Usar JSONB para un almacenamiento y consulta eficiente de JSON
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Opcional: Crear un trigger para actualizar automáticamente 'updated_at'
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Dropear el trigger si ya existe para evitar errores en reinicios
DROP TRIGGER IF EXISTS set_timestamp ON pedidos;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON pedidos
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Mensaje de log para confirmar la ejecución
DO $$
BEGIN
  RAISE NOTICE 'Tabla "pedidos" y trigger "set_timestamp" creados/verificados.';
END $$;
```

-----

### **6. Instrucciones Finales de Ejecución**

Has creado todos los archivos. Ahora, solo falta poner todo en marcha.

#### **Paso 1: Crear Plantillas PDF de Prueba**

La aplicación necesita archivos PDF para funcionar. No tienen que tener contenido, pueden estar vacíos. Abre tu terminal en la raíz del proyecto (`tuu-capricho-project/`) y ejecuta estos comandos:

```sh
# Crea un archivo de plantilla en la sección "Notas"
touch PDFs/Notas/Notas-Rayadas.pdf

# Crea otro archivo de plantilla en la misma sección
touch PDFs/Notas/Notas-Punteadas.pdf

# Crea una plantilla en la sección "Planificador Semanal"
touch PDFs/Planificador\ Semanal/Semana-Vista-Horizontal.pdf
```

> Si tu sistema no tiene el comando `touch`, simplemente crea archivos en blanco con esos nombres dentro de las carpetas correspondientes usando tu explorador de archivos.

#### **Paso 2: Construir y Ejecutar la Aplicación**

Con todos los archivos en su lugar, el último paso es ejecutar un solo comando desde la raíz del proyecto. Este comando le dirá a Docker que lea tu `docker-compose.yml`, construya las imágenes de tus aplicaciones y las inicie.

Abre tu terminal en la carpeta raíz `tuu-capricho-project/` y ejecuta:

```sh
docker-compose up --build
```

> La primera vez puede tardar varios minutos mientras se descargan las imágenes y se instalan las dependencias. Las siguientes veces será mucho más rápido. Verás muchos logs de los diferentes servicios en tu terminal.

#### **Paso 3: ¡Usa tu Aplicación\!**

Una vez que los logs se calmen y veas mensajes como `Backend server is running...` y `PostgreSQL connection has been established...`, tu aplicación está lista.

Abre tu navegador web y ve a la siguiente dirección:

**[http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)**

¡Felicidades\! Has ensamblado y ejecutado con éxito el proyecto "Tuu Capricho". Ahora puedes interactuar con la interfaz para crear tu propia agenda personalizada.