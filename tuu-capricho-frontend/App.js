import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // For modal
import { GripVertical, Plus, X, UploadCloud, FileText, ShoppingBag, BookOpen } from 'lucide-react'; // Icons

// --- Utility Components (for better readability) ---

// Modal Component
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X size={24} />
        </button>
        {title && <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body
  );
};

// Simple Message Box Component
const MessageBox = ({ message, type, onClose }) => {
  if (!message) return null;

  const typeClasses = {
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    error: 'bg-red-100 border-red-400 text-red-700',
  };

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className={`rounded-xl shadow-lg p-6 relative max-w-sm w-full border ${typeClasses[type] || typeClasses.info} animate-scale-in`}>
        <p className="text-lg font-medium text-center">{message}</p>
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:from-pink-500 hover:to-purple-600 transition-all transform hover:scale-105"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};


// --- App Component (Main Application) ---

// Define dummy data for sections and templates
const DUMMY_SECTIONS = [
  { id: '1', name: 'Notas', description: 'Sección para tomar apuntes.', isVariablePages: true, percentageAdditional: 0.05, basePriceSection: 500 },
  { id: '2', name: 'Agenda Semanal', description: 'Organizador semanal.', isVariablePages: false, percentageAdditional: 0.10, basePriceSection: 800 },
  { id: '3', name: 'Calendario Mensual', description: 'Vista mensual del calendario.', isVariablePages: false, percentageAdditional: 0.07, basePriceSection: 600 },
  { id: '4', name: 'Habit Tracker', description: 'Registro de hábitos diarios.', isVariablePages: true, percentageAdditional: 0.08, basePriceSection: 700 },
  { id: '5', name: 'Objetivos/Metas', description: 'Definición y seguimiento de objetivos.', isVariablePages: true, percentageAdditional: 0.06, basePriceSection: 550 },
  { id: '6', name: 'Lista de Tareas', description: 'Listado de pendientes.', isVariablePages: true, percentageAdditional: 0.04, basePriceSection: 450 },
  { id: '7', name: 'Fechas Importantes/Cumpleaños', description: 'Recordatorios de eventos.', isVariablePages: false, percentageAdditional: 0.03, basePriceSection: 400 },
  { id: '8', name: 'Finanzas/Gastos', description: 'Registro de ingresos y egresos.', isVariablePages: true, percentageAdditional: 0.09, basePriceSection: 750 },
  { id: '9', name: 'Mapas o Información Útil', description: 'Mapas y datos de interés.', isVariablePages: false, percentageAdditional: 0.02, basePriceSection: 350 },
];

const DUMMY_TEMPLATES = {
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

const BASE_PRICE = 3000; // Precio base de la agenda

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'customize'
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]); // { section: {}, pages: N, template: {} }
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [totalPrice, setTotalPrice] = useState(BASE_PRICE);
  const [messageBox, setMessageBox] = useState({ message: '', type: 'info', isOpen: false });

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImage(null);
      setCoverImagePreview(null);
    }
  };

  // Open add section modal
  const openAddSectionModal = () => {
    setIsAddSectionModalOpen(true);
  };

  // Add section to selected sections
  const addSection = (sectionId) => {
    const sectionToAdd = DUMMY_SECTIONS.find(s => s.id === sectionId);
    if (sectionToAdd && !selectedSections.some(s => s.section.id === sectionId)) {
      setSelectedSections(prev => [
        ...prev,
        {
          section: sectionToAdd,
          pages: sectionToAdd.isVariablePages ? 40 : null, // Default pages
          template: DUMMY_TEMPLATES[sectionId]?.[0] || null, // Default first template
        }
      ]);
    }
    setIsAddSectionModalOpen(false);
  };

  // Remove section
  const removeSection = (sectionId) => {
    setSelectedSections(prev => prev.filter(s => s.section.id !== sectionId));
  };

  // Handle page quantity change for a section
  const handlePagesChange = (sectionId, value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 40 && numValue <= 80) {
      setSelectedSections(prev =>
        prev.map(item =>
          item.section.id === sectionId ? { ...item, pages: numValue } : item
        )
      );
    } else if (value === '') { // Allow empty input temporarily for user to type
        setSelectedSections(prev =>
            prev.map(item =>
                item.section.id === sectionId ? { ...item, pages: '' } : item
            )
        );
    }
  };

  // Handle template selection change for a section
  const handleTemplateChange = (sectionId, templateId) => {
    setSelectedSections(prev =>
      prev.map(item =>
        item.section.id === sectionId
          ? { ...item, template: DUMMY_TEMPLATES[sectionId].find(t => t.id === templateId) }
          : item
      )
    );
  };

  // Handle drag and drop reordering of sections
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("sectionIndex", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e, targetIndex) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("sectionIndex"), 10);
    const draggedSection = selectedSections[draggedIndex];
    let newSections = [...selectedSections];
    newSections.splice(draggedIndex, 1); // Remove dragged item
    newSections.splice(targetIndex, 0, draggedSection); // Insert at target
    setSelectedSections(newSections);
  };

  // Calculate total price effect
  useEffect(() => {
    let currentPrice = BASE_PRICE;
    selectedSections.forEach(item => {
      const { section, pages } = item;
      if (section.isVariablePages && pages) {
        currentPrice += (section.percentageAdditional * pages * section.basePriceSection) / 100; // Simplified formula
      } else {
        currentPrice += section.basePriceSection; // Fixed price for fixed-page sections
      }
    });
    setTotalPrice(currentPrice);
  }, [selectedSections]);

  // Simulate PDF generation
  const handlePreviewAgenda = async () => {
    setMessageBox({ message: 'Generando previsualización de la agenda...', type: 'info', isOpen: true });
    // Simulate API call to backend for PDF generation
    // In a real app, you'd send coverImage, selectedSections, textColor to backend
    // and receive a PDF URL or base64 data.
    console.log("Datos para generar PDF:", {
      coverImage: coverImage ? coverImage.name : 'No image',
      selectedSections,
      textColor
    });

    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

    setMessageBox({ message: 'Previsualización generada con éxito. (Simulado)', type: 'success', isOpen: true });
    // In a real app, here you would open the PDF in a new tab or display it.
    // window.open('your_backend_pdf_url_here', '_blank');
  };

  // Simulate purchase
  const handlePurchase = (type) => {
    setMessageBox({ message: `¡Pedido de agenda ${type === 'physical' ? 'física' : 'digital'} iniciado! (Simulado)`, type: 'success', isOpen: true });
    // In a real app, send order details to backend
    console.log("Detalles del pedido:", { type, totalPrice, coverImage: coverImage ? coverImage.name : 'N/A', selectedSections, textColor });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 font-inter text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center rounded-b-xl">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
          Tuu Capricho
        </h1>
        <nav>
          <button
            onClick={() => setCurrentPage('home')}
            className={`mr-4 px-4 py-2 rounded-lg text-lg font-semibold transition-all ${currentPage === 'home' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600'}`}
          >
            Inicio
          </button>
          <button
            onClick={() => setCurrentPage('customize')}
            className={`px-4 py-2 rounded-lg text-lg font-semibold transition-all ${currentPage === 'customize' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600'}`}
          >
            Personaliza tu Agenda
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 lg:p-10">
        {currentPage === 'home' && (
          <section className="text-center py-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
              Bienvenida a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Tuu Capricho</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Crea la agenda de tus sueños, única y perfecta para ti. ¡Personaliza cada detalle!
            </p>

            {/* Gallery of pre-made products (mock) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
                <img
                  src="https://placehold.co/400x300/F0F8FF/333333?text=Agenda+Romántica"
                  alt="Agenda Romántica"
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/F0F8FF/333333?text=Imagen+no+disponible"; }}
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Agenda "Sueños Rosas"</h3>
                  <p className="text-gray-600 mb-4">
                    Una agenda con diseños florales y tonos pastel. Perfecta para amantes de lo romántico.
                  </p>
                  <span className="text-lg font-semibold text-purple-600">$4500 ARS</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
                <img
                  src="https://placehold.co/400x300/FFF0F5/333333?text=Agenda+Minimalista"
                  alt="Agenda Minimalista"
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/FFF0F5/333333?text=Imagen+no+disponible"; }}
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Agenda "Esencia Simple"</h3>
                  <p className="text-gray-600 mb-4">
                    Diseño limpio y funcional, ideal para quienes buscan simplicidad y organización.
                  </p>
                  <span className="text-lg font-semibold text-purple-600">$4200 ARS</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
                <img
                  src="https://placehold.co/400x300/F5F5DC/333333?text=Agenda+Creativa"
                  alt="Agenda Creativa"
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/F5F5DC/333333?text=Imagen+no+disponible"; }}
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Agenda "Explosión de Color"</h3>
                  <p className="text-gray-600 mb-4">
                    Una explosión de colores vibrantes y patrones divertidos para inspirarte cada día.
                  </p>
                  <span className="text-lg font-semibold text-purple-600">$4800 ARS</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('customize')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xl rounded-full shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 duration-300 flex items-center justify-center mx-auto"
            >
              <BookOpen className="mr-3" size={28} />
              Personaliza Tu Propia Agenda
            </button>
          </section>
        )}

        {currentPage === 'customize' && (
          <section className="bg-white p-8 rounded-xl shadow-xl">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
              Personaliza tu Agenda
            </h2>

            {/* Step 1: Cover Image Upload */}
            <div className="mb-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
              <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                1. Carátula de la Agenda
              </h3>
              <p className="text-gray-600 mb-4">Sube una imagen para la tapa de tu agenda.</p>
              <label htmlFor="coverImageUpload" className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-purple-400 rounded-lg p-6 text-purple-600 hover:border-purple-600 hover:text-purple-800 transition-colors duration-200">
                <UploadCloud size={48} className="mb-3" />
                <span className="text-lg font-semibold">Haz clic para subir tu imagen</span>
                <input
                  id="coverImageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {coverImagePreview && (
                <div className="mt-6 flex flex-col items-center">
                  <h4 className="text-lg font-semibold mb-2">Previsualización de la Carátula:</h4>
                  <img
                    src={coverImagePreview}
                    alt="Previsualización de la Carátula"
                    className="max-w-xs max-h-60 rounded-lg shadow-md border border-gray-200 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x300/F0F0F0/FF0000?text=Error+Carga+Imagen"; }}
                  />
                  <p className="text-sm text-gray-500 mt-2">{coverImage.name}</p>
                </div>
              )}
            </div>

            {/* Step 2: Section Selection and Reordering */}
            <div className="mb-8 p-6 bg-pink-50 rounded-xl border border-pink-200">
              <h3 className="text-2xl font-bold text-pink-800 mb-4 flex items-center">
                2. Secciones y Contenido
              </h3>
              <p className="text-gray-600 mb-4">
                Añade y organiza las secciones de tu agenda. Arrastra y suelta para reordenar.
              </p>

              <button
                onClick={openAddSectionModal}
                className="px-6 py-3 bg-gradient-to-r from-pink-400 to-red-500 text-white font-semibold rounded-lg shadow-md hover:from-pink-500 hover:to-red-600 transition-all transform hover:scale-105 flex items-center justify-center mb-6"
              >
                <Plus size={24} className="mr-2" />
                Añadir Sección
              </button>

              <Modal
                isOpen={isAddSectionModalOpen}
                onClose={() => setIsAddSectionModalOpen(false)}
                title="Seleccionar Secciones"
              >
                <p className="text-gray-600 mb-4">Selecciona las secciones que quieres incluir en tu agenda.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2">
                  {DUMMY_SECTIONS.map(section => (
                    <div
                      key={section.id}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between shadow-sm"
                    >
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{section.name}</h4>
                        <p className="text-sm text-gray-500">{section.description}</p>
                      </div>
                      <button
                        onClick={() => addSection(section.id)}
                        className="ml-4 p-2 bg-gradient-to-r from-purple-400 to-blue-500 text-white rounded-full hover:from-purple-500 hover:to-blue-600 transition-all transform hover:scale-110"
                        title="Añadir esta sección"
                        disabled={selectedSections.some(s => s.section.id === section.id)}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </Modal>

              {/* Selected Sections List */}
              {selectedSections.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md p-4">
                  {selectedSections.map((item, index) => (
                    <div
                      key={item.section.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-3 border border-gray-200 rounded-lg bg-white shadow-sm cursor-grab active:cursor-grabbing hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center flex-grow mb-4 md:mb-0">
                        <GripVertical size={24} className="text-gray-400 mr-3 shrink-0" />
                        <div className="flex-grow">
                          <h4 className="text-xl font-bold text-gray-800">{item.section.name}</h4>
                          <p className="text-sm text-gray-500">{item.section.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
                        {item.section.isVariablePages && (
                          <div className="flex items-center">
                            <label htmlFor={`pages-${item.section.id}`} className="text-gray-700 text-sm font-medium mr-2">Páginas (40-80):</label>
                            <input
                              id={`pages-${item.section.id}`}
                              type="number"
                              min="40"
                              max="80"
                              value={item.pages === null ? '' : item.pages}
                              onChange={(e) => handlePagesChange(item.section.id, e.target.value)}
                              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-colors"
                            />
                          </div>
                        )}

                        <div className="flex items-center">
                          <label htmlFor={`template-${item.section.id}`} className="text-gray-700 text-sm font-medium mr-2">Template:</label>
                          <select
                            id={`template-${item.section.id}`}
                            value={item.template ? item.template.id : ''}
                            onChange={(e) => handleTemplateChange(item.section.id, e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-colors"
                          >
                            {DUMMY_TEMPLATES[item.section.id]?.map(template => (
                              <option key={template.id} value={template.id}>
                                {template.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={() => removeSection(item.section.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 hover:text-red-800 transition-colors self-end md:self-auto shrink-0"
                          title="Eliminar sección"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 italic mt-4">Aún no has añadido ninguna sección. ¡Comienza a personalizar!</p>
              )}
            </div>

            {/* Step 3: Text Color Selection */}
            <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                3. Color de Texto
              </h3>
              <p className="text-gray-600 mb-4">Selecciona el color de texto para el contenido de tus secciones.</p>
              <div className="flex items-center">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-16 h-12 rounded-lg border-2 border-blue-400 cursor-pointer"
                  title="Seleccionar color de texto"
                />
                <span className="ml-4 text-lg font-semibold" style={{ color: textColor }}>
                  Color seleccionado
                </span>
              </div>
            </div>

            {/* Price Calculation */}
            <div className="flex justify-end items-center mb-8 p-4 bg-green-50 rounded-xl border border-green-200">
              <span className="text-3xl font-extrabold text-green-700 mr-4">Precio Total Estimado:</span>
              <span className="text-5xl font-extrabold text-green-900 animate-pulse-price">
                ${totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ARS
              </span>
            </div>

            {/* Preview and Purchase Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={handlePreviewAgenda}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold text-xl rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all transform hover:scale-105 duration-300 flex items-center justify-center"
              >
                <FileText size={28} className="mr-3" />
                Previsualizar Agenda
              </button>

              <button
                onClick={() => handlePurchase('physical')}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-red-600 text-white font-extrabold text-xl rounded-full shadow-lg hover:from-pink-600 hover:to-red-700 transition-all transform hover:scale-105 duration-300 flex items-center justify-center"
              >
                <ShoppingBag size={28} className="mr-3" />
                Comprar Agenda Física
              </button>

              <button
                onClick={() => handlePurchase('digital')}
                className="col-span-1 md:col-span-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-600 text-white font-extrabold text-xl rounded-full shadow-lg hover:from-blue-600 hover:to-teal-700 transition-all transform hover:scale-105 duration-300 flex items-center justify-center"
              >
                <BookOpen size={28} className="mr-3" />
                Comprar PDF Digital (¡A un menor valor!)
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Message Box */}
      <MessageBox
        message={messageBox.message}
        type={messageBox.type}
        isOpen={messageBox.isOpen}
        onClose={() => setMessageBox({ ...messageBox, isOpen: false })}
      />
    </div>
  );
}

export default App;

