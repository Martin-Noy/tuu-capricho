// frontend/src/pages/CustomizeAgendaPage.js
import React, { useState, useEffect } from 'react';
import { DUMMY_SECTIONS, DUMMY_TEMPLATES, BASE_PRICE } from '../data/constants.js';
import MessageBox from '../components/MessageBox';
import PriceSummary from '../components/PriceSummary';
import OrderButtons from '../components/OrderButtons';
import { useNavigate } from 'react-router-dom';

// Nuevos componentes seccionados
import CoverImageSection from '../components/CoverImageSection';
import SectionsSection from '../components/SectionsSection';
import TextColorSection from '../components/TextColorSection';

function CustomizeAgendaPage() {
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [totalPrice, setTotalPrice] = useState(BASE_PRICE);
  const [messageBox, setMessageBox] = useState({ message: '', type: 'info', isOpen: false });
  const navigate = useNavigate();

  // --- Handlers de imagen ---
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

  // --- Handlers de secciones ---
  // Open add section modal
  const openAddSectionModal = () => {
    setIsAddSectionModalOpen(true);
  };

  // Add section to selected sections
  const addSection = (sectionId) => {
    const sectionToAdd = Object.values(DUMMY_SECTIONS).find(s => s.id === sectionId);
    const templatesArray = Array.isArray(DUMMY_TEMPLATES[sectionId]) ? DUMMY_TEMPLATES[sectionId] : [];
    if (sectionToAdd && !selectedSections.some(s => s.section.id === sectionId)) {
      setSelectedSections(prev => [
        ...prev,
        {
          section: sectionToAdd,
          pages: sectionToAdd.isVariablePages ? 40 : null,
          template: templatesArray.length > 0 ? templatesArray[0] : null,
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
          ? {
              ...item,
              template: (Array.isArray(DUMMY_TEMPLATES[sectionId])
                ? DUMMY_TEMPLATES[sectionId].find(t => t.id === templateId)
                : null)
            }
          : item
      )
    );
  };

  // --- Handlers de drag & drop ---
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

  // --- Handlers de precio ---
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

  // --- Handlers de preview y compra ---
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
      {/* --- Título principal --- */}
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Personaliza tu Agenda
      </h2>

      {/* --- Paso 1: Carátula --- */}
      <CoverImageSection
        coverImage={coverImage}
        coverImagePreview={coverImagePreview}
        onChange={handleImageUpload}
      />

      {/* --- Paso 2: Secciones --- */}
      <SectionsSection
        DUMMY_SECTIONS={DUMMY_SECTIONS}
        selectedSections={selectedSections}
        openAddSectionModal={openAddSectionModal}
        isAddSectionModalOpen={isAddSectionModalOpen}
        addSection={addSection}
        removeSection={removeSection}
        handlePagesChange={handlePagesChange}
        handleTemplateChange={handleTemplateChange}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        setIsAddSectionModalOpen={setIsAddSectionModalOpen}
      />

      {/* --- Paso 3: Color de texto --- */}
      <TextColorSection
        textColor={textColor}
        setTextColor={setTextColor}
      />

      {/* --- Resumen de precio --- */}
      <PriceSummary totalPrice={totalPrice} />

      {/* --- Botones de acción --- */}
      <OrderButtons
        onPreview={handlePreviewAgenda}
        onBuyPhysical={() => handlePurchase('physical')}
        onBuyDigital={() => handlePurchase('digital')}
      />

      {/* --- Mensajes --- */}
      <MessageBox
        message={messageBox.message}
        type={messageBox.type}
        isOpen={messageBox.isOpen}
        onClose={() => setMessageBox({ ...messageBox, isOpen: false })}
      />

      {/* --- Botón volver --- */}
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