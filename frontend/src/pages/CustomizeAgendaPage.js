// frontend/src/pages/CustomizeAgendaPage.js
import React, { useState, useEffect } from 'react';
import { Plus, X, UploadCloud, FileText, ShoppingBag, BookOpen } from 'lucide-react'; // Icons
import { DUMMY_SECTIONS, DUMMY_TEMPLATES, BASE_PRICE } from '../data/constants'; // Datos dummy movidos
import Modal from '../components/Modal'; // Componente Modal
import MessageBox from '../components/MessageBox'; // Componente MessageBox

// Aquí irían los sub-componentes que crearemos más adelante:
// import CoverImageUpload from '../components/CoverImageUpload';
// import SectionCustomizer from '../components/SectionCustomizer';
// import TextColorPicker from '../components/TextColorPicker';
// import PriceSummary from '../components/PriceSummary';
// import OrderButtons from '../components/OrderButtons';

function CustomizeAgendaPage() {
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]);
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

    // En un escenario real, harías una llamada a tu backend:
    /*
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
    */

    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    setMessageBox({ message: 'Previsualización generada con éxito. (Simulado)', type: 'success', isOpen: true });
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
                {/* Puedes mover esta lógica de renderizado de sección a un componente `SectionItem` */}
                <div className="flex items-center flex-grow mb-4 md:mb-0">
                  <Plus size={24} className="text-gray-400 mr-3 shrink-0" /> {/* Reemplazado GripVertical por Plus para evitar icono no importado */}
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

      {/* Message Box */}
      <MessageBox
        message={messageBox.message}
        type={messageBox.type}
        isOpen={messageBox.isOpen}
        onClose={() => setMessageBox({ ...messageBox, isOpen: false })}
      />
    </section>
  );
}

export default CustomizeAgendaPage;