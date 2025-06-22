// frontend/src/pages/CustomizeAgendaPage.js
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react'; // Icons
import { DUMMY_SECTIONS, DUMMY_TEMPLATES, BASE_PRICE } from '../data/constants'; // Datos dummy movidos
import Modal from '../components/Modal'; // Componente Modal
import MessageBox from '../components/MessageBox'; // Componente MessageBox
import { useNavigate } from 'react-router-dom';

// Aquí irían los sub-componentes que crearemos más adelante:
import CoverImageUpload from '../components/CoverImageUpload';
import SectionCustomizer from '../components/SectionCustomizer';
import TextColorPicker from '../components/TextColorPicker';
import PriceSummary from '../components/PriceSummary';
import OrderButtons from '../components/OrderButtons';
import db from '../config/db';

function CustomizeAgendaPage() {
  console.log("🚀 ~ CustomizeAgendaPage ~ CustomizeAgendaPage:");

  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [totalPrice, setTotalPrice] = useState(BASE_PRICE);
  const [messageBox, setMessageBox] = useState({ message: '', type: 'info', isOpen: false });
  const navigate = useNavigate();

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
        currentPrice += (section.percentageAdditional * pages * section.basePriceSection) / 100;
      } else {
        currentPrice += section.basePriceSection;
      }
    });
    setTotalPrice(currentPrice);
  }, [selectedSections]);

  // Simulate PDF generation
  const handlePreviewAgenda = async () => {
    setMessageBox({ message: 'Generando previsualización de la agenda...', type: 'info', isOpen: true });
    // Simulate API call to backend for PDF generation
    console.log("Datos para generar PDF:", {
      coverImage: coverImage ? coverImage.name : 'No image',
      selectedSections,
      textColor
    });


    const formData = new FormData();
    if (coverImage) formData.append('coverImage', coverImage);
    formData.append('selectedSections', JSON.stringify(selectedSections));
    formData.append('textColor', textColor);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/pdf/generate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al generar PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      setMessageBox({ message: 'Previsualización generada con éxito.', type: 'success', isOpen: true });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setMessageBox({ message: `Error al generar previsualización: ${error.message}`, type: 'error', isOpen: true });
    }
    // await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    // setMessageBox({ message: 'Previsualización generada con éxito. (Simulado)', type: 'success', isOpen: true });
  };

  // Simulate purchase
  const handlePurchase = async (type) => {
    setMessageBox({ message: `Iniciando pedido de agenda ${type === 'physical' ? 'física' : 'digital'}...`, type: 'info', isOpen: true });
    // In a real app, send order details to backend
    console.log("Detalles del pedido:", { type, totalPrice, coverImage: coverImage ? coverImage.name : 'N/A', selectedSections, textColor });

    // Ejemplo de llamada a la API de pedidos:
    /*
    try {
      const orderDetails = {
        userId: 'someUserId', // Replace with actual user ID
        items: selectedSections.map(s => ({
          sectionId: s.section.id,
          pages: s.pages,
          templateId: s.template?.id,
          sectionPrice: s.section.isVariablePages && s.pages ? (s.section.percentageAdditional * s.pages * s.section.basePriceSection) / 100 : s.section.basePriceSection,
        })),
        totalPrice: totalPrice,
        orderType: type,
        coverImageInfo: coverImage ? { name: coverImage.name, url: 'some_uploaded_url' } : null,
        textColor: textColor,
      };
      const response = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
      });
      if (!response.ok) throw new Error('Error al crear el pedido');
      const data = await response.json();
      setMessageBox({ message: `¡Pedido ${data.orderId} de agenda ${type === 'physical' ? 'física' : 'digital'} iniciado!`, type: 'success', isOpen: true });
    } catch (error) {
      console.error('Error creating order:', error);
      setMessageBox({ message: `Error al procesar el pedido: ${error.message}`, type: 'error', isOpen: true });
    }
    */
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    setMessageBox({ message: `¡Pedido de agenda ${type === 'physical' ? 'física' : 'digital'} iniciado! (Simulado)`, type: 'success', isOpen: true });

  };

  return (
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
        <CoverImageUpload
          coverImage={coverImage}
          coverImagePreview={coverImagePreview}
          onChange={handleImageUpload}
        />
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
        <SectionCustomizer
          sections={selectedSections}
          onAdd={openAddSectionModal}
          onRemove={removeSection}
          onReorder={(fromIdx, toIdx) => {
            // Implementa la lógica de reordenar usando handleDragStart, handleDrop, etc.
            const newSections = [...selectedSections];
            const [removed] = newSections.splice(fromIdx, 1);
            newSections.splice(toIdx, 0, removed);
            setSelectedSections(newSections);
          }}
        />
      </div>

      {/* Step 3: Text Color Selection */}
      <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
          3. Color de Texto
        </h3>
        <p className="text-gray-600 mb-4">Selecciona el color de texto para el contenido de tus secciones.</p>
        <TextColorPicker value={textColor} onChange={e => setTextColor(e.target.value)} />
      </div>

      {/* Price Calculation */}
      <PriceSummary totalPrice={totalPrice} />

      {/* Preview and Purchase Options */}
      <OrderButtons
        onPreview={handlePreviewAgenda}
        onBuyPhysical={() => handlePurchase('physical')}
        onBuyDigital={() => handlePurchase('digital')}
      />

      {/* Message Box */}
      <MessageBox
        message={messageBox.message}
        type={messageBox.type}
        isOpen={messageBox.isOpen}
        onClose={() => setMessageBox({ ...messageBox, isOpen: false })}
      />

      {/* Example button to navigate back to home */}
      <button
        onClick={() => navigate('/')}
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all"
      >
        Volver al inicio
      </button>
    </section>
  );
}

export default CustomizeAgendaPage;