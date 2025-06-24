import React from 'react';
import Modal from './Modal';
import { DUMMY_TEMPLATES } from '../data/constants.js'; // Importa DUMMY_TEMPLATES aquí

function SectionsSection({
  DUMMY_SECTIONS,
  selectedSections,
  openAddSectionModal,
  isAddSectionModalOpen,
  addSection,
  removeSection,
  handlePagesChange,
  handleTemplateChange,
  handleDragStart,
  handleDragOver,
  handleDrop,
  setIsAddSectionModalOpen,
  totalPagesUsed,
  maxPages
}) {
  const pagesLeft = maxPages - totalPagesUsed;

  return (
    <div className="mb-8 p-6 bg-pink-50 rounded-xl border border-pink-200">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-2xl font-bold text-pink-800">2. Secciones y Contenido</h3>
          <p className="text-gray-600">Añade, organiza y personaliza las secciones de tu agenda.</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-pink-800">
            Páginas: {totalPagesUsed} / {maxPages}
          </div>
          <div className="text-sm text-gray-600">
            ({pagesLeft} restantes)
          </div>
        </div>
      </div>
      
      <button
        onClick={openAddSectionModal}
        className="px-6 py-3 bg-gradient-to-r from-pink-400 to-red-500 text-white font-semibold rounded-lg shadow-md hover:from-pink-500 hover:to-red-600 transition-all transform hover:scale-105 mb-6"
      >
        Añadir Sección
      </button>

      {/* Modal para añadir secciones */}
      <Modal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        title="Seleccionar Secciones"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2">
          {Object.values(DUMMY_SECTIONS).map(section => (
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
                +
              </button>
            </div>
          ))}
        </div>
      </Modal>

      {/* Lista de secciones seleccionadas */}
      <ul>
        {selectedSections.map((item, idx) => {
          const currentSectionTemplates = Array.isArray(DUMMY_TEMPLATES[item.section.id]) ? DUMMY_TEMPLATES[item.section.id] : [];
          const maxAllowedForThisInput = (parseInt(item.pages, 10) || 0) + pagesLeft;

          return (
            <li
              key={item.section.id}
              className="mb-4 p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row items-start gap-4"
              draggable
              onDragStart={e => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, idx)}
            >
              <div className="flex-grow">
                <h4 className="font-semibold text-lg text-gray-800">{item.section.name}</h4>
                <p className="text-sm text-gray-500 mb-3">{item.section.description}</p>
                
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  {/* Selector de Template */}
                  <select
                    value={item.template?.id || ''}
                    onChange={e => handleTemplateChange(item.section.id, e.target.value)}
                    className="border rounded px-2 py-1 w-full md:w-48"
                  >
                    {currentSectionTemplates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Información de Páginas y botón de eliminar sección */}
              <div className="flex flex-col items-end">
                {item.section.isVariablePages && (
                  <input
                    type="number"
                    min={40}
                    max={80}
                    value={item.pages}
                    onChange={e => handlePagesChange(item.section.id, e.target.value)}
                    className="border rounded px-2 py-1 w-24 text-center mb-2"
                    placeholder="Páginas"
                  />
                )}
                <button
                  onClick={() => removeSection(item.section.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                  title="Quitar sección"
                >
                  ×
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SectionsSection;