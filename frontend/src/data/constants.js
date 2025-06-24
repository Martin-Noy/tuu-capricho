// frontend/src/data/constants.js

export const DUMMY_SECTIONS = [
  // A las secciones con páginas variables, les ponemos un default.
  { id: '1', name: 'Notas', description: 'Sección para tomar apuntes.', isVariablePages: true, pageCount: 20, percentageAdditional: 0.05, basePriceSection: 500 },
  // A las secciones con páginas fijas, les definimos su total.
  { id: '2', name: 'Agenda Semanal', description: 'Organizador semanal.', isVariablePages: false, pageCount: 54, percentageAdditional: 0.10, basePriceSection: 800 },
  { id: '3', name: 'Calendario Mensual', description: 'Vista mensual del calendario.', isVariablePages: false, pageCount: 12, percentageAdditional: 0.07, basePriceSection: 600 },
  { id: '4', name: 'Habit Tracker', description: 'Registro de hábitos diarios.', isVariablePages: true, pageCount: 10, percentageAdditional: 0.08, basePriceSection: 700 },
  { id: '5', name: 'Objetivos/Metas', description: 'Definición y seguimiento de objetivos.', isVariablePages: true, pageCount: 10, percentageAdditional: 0.06, basePriceSection: 550 },
  { id: '6', name: 'Lista de Tareas', description: 'Listado de pendientes.', isVariablePages: true, pageCount: 10, percentageAdditional: 0.04, basePriceSection: 450 },
  { id: '7', name: 'Fechas Importantes/Cumpleaños', description: 'Recordatorios de eventos.', isVariablePages: false, pageCount: 4, percentageAdditional: 0.03, basePriceSection: 400 },
  { id: '8', name: 'Finanzas/Gastos', description: 'Registro de ingresos y egresos.', isVariablePages: true, pageCount: 12, percentageAdditional: 0.09, basePriceSection: 750 },
  { id: '9', name: 'Mapas o Información Útil', description: 'Mapas y datos de interés.', isVariablePages: false, pageCount: 2, percentageAdditional: 0.02, basePriceSection: 350 },
];

export const DUMMY_TEMPLATES = {
  '1': [ // Notas
    { id: '1-1', name: 'Rayado Clásico', url: 'https://placehold.co/150x200/e0e0e0/ffffff?text=Temp+Nota+1' },
    { id: '1-2', name: 'Puntos', url: 'https://placehold.co/150x200/d0d0d0/ffffff?text=Temp+Nota+2' },
  ],
  '2': [ // Agenda Semanal
    { id: '2-1', name: 'Lunes a Domingo', url: 'https://placehold.co/150x200/c0c0c0/ffffff?text=Temp+Agenda+1' },
    { id: '2-2', name: 'Vista Horizontal', url: 'https://placehold.co/150x200/b0b0b0/ffffff?text=Temp+Agenda+2' },
  ],
  '3': [ // Calendario Mensual
    { id: '3-1', name: 'Mes en una Página', url: 'https://placehold.co/150x200/a0a0a0/ffffff?text=Temp+Calendario+1' },
    { id: '3-2', name: 'Mes con Notas', url: 'https://placehold.co/150x200/909090/ffffff?text=Temp+Calendario+2' },
  ],
  '4': [ // Habit Tracker
    { id: '4-1', name: 'Diario Simple', url: 'https://placehold.co/150x200/808080/ffffff?text=Temp+Habit+1' },
    { id: '4-2', name: 'Semanal Gráfico', url: 'https://placehold.co/150x200/707070/ffffff?text=Temp+Habit+2' },
  ],
  '5': [ // Objetivos/Metas
    { id: '5-1', name: 'SMART Goals', url: 'https://placehold.co/150x200/606060/ffffff?text=Temp+Objetivos+1' },
    { id: '5-2', name: 'Vision Board', url: 'https://placehold.co/150x200/505050/ffffff?text=Temp+Objetivos+2' },
  ],
  '6': [ // Lista de Tareas
    { id: '6-1', name: 'Prioridades ABC', url: 'https://placehold.co/150x200/404040/ffffff?text=Temp+Tareas+1' },
    { id: '6-2', name: 'Checklist', url: 'https://placehold.co/150x200/303030/ffffff?text=Temp+Tareas+2' },
  ],
  '7': [ // Fechas Importantes/Cumpleaños
    { id: '7-1', name: 'Listado Cronológico', url: 'https://placehold.co/150x200/202020/ffffff?text=Temp+Fechas+1' },
    { id: '7-2', name: 'Año Visual', url: 'https://placehold.co/150x200/101010/ffffff?text=Temp+Fechas+2' },
  ],
  '8': [ // Finanzas/Gastos
    { id: '8-1', name: 'Control de Gastos', url: 'https://placehold.co/150x200/f0f0f0/ffffff?text=Temp+Finanzas+1' },
    { id: '8-2', name: 'Presupuesto Mensual', url: 'https://placehold.co/150x200/e0e0e0/ffffff?text=Temp+Finanzas+2' },
  ],
  '9': [ // Mapas o Información Útil
    { id: '9-1', name: 'Mapamundi', url: 'https://placehold.co/150x200/d0d0d0/ffffff?text=Temp+Info+1' },
    { id: '9-2', name: 'Unidades de Medida', url: 'https://placehold.co/150x200/c0c0c0/ffffff?text=Temp+Info+2' },
  ],
};

export const BASE_PRICE = 3000; // Precio base de la agenda

export const AGENDAS = [
  {
    img: "https://placehold.co/400x300/F0F8FF/333333?text=Agenda+Romántica",
    alt: "Agenda Romántica",
    title: 'Agenda "Sueños Rosas"',
    desc: "Una agenda con diseños florales y tonos pastel. Perfecta para amantes de lo romántico.",
    price: "$4500 ARS"
  },
  {
    img: "https://placehold.co/400x300/FFF0F5/333333?text=Agenda+Minimalista",
    alt: "Agenda Minimalista",
    title: 'Agenda "Esencia Simple"',
    desc: "Diseño limpio y funcional, ideal para quienes buscan simplicidad y organización.",
    price: "$4200 ARS"
  },
  {
    img: "https://placehold.co/400x300/F5F5DC/333333?text=Agenda+Creativa",
    alt: "Agenda Creativa",
    title: 'Agenda "Explosión de Color"',
    desc: "Una explosión de colores vibrantes y patrones divertidos para inspirarte cada día.",
    price: "$4800 ARS"
  }
];