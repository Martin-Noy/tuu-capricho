import React from 'react';
import Modal from './Modal';

function SectionsSection({
  DUMMY_SECTIONS,
  DUMMY_TEMPLATES,
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
  setIsAddSectionModalOpen
}) {
  console.log("🚀 ~ DUMMY_TEMPLATES:", DUMMY_TEMPLATES)
  
  return (
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
        Añadir Sección
      </button>
      <Modal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        title="Seleccionar Secciones"
      >
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
                +
              </button>
            </div>
          ))}
        </div>
      </Modal>
      <ul>
        {selectedSections.map((item, idx) => (
          <li
            key={item.section.id}
            className="mb-4 p-4 bg-white rounded-lg shadow flex flex-col md:flex-row items-center gap-4"
            draggable
            onDragStart={e => handleDragStart(e, idx)}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, idx)}
          >
            <div className="flex-1">
              <div className="font-semibold">{item.section.name}</div>
              <div className="text-sm text-gray-500">{item.section.description}</div>
              {item.section.isVariablePages && (
                <input
                  type="number"
                  min={40}
                  max={80}
                  value={item.pages}
                  onChange={e => handlePagesChange(item.section.id, e.target.value)}
                  className="mt-2 border rounded px-2 py-1 w-24"
                  placeholder="Páginas"
                />
              )}
              <select
                value={item.template?.id || ''}
                onChange={e => handleTemplateChange(item.section.id, e.target.value)}
                className="mt-2 border rounded px-2 py-1 w-full md:w-48"
              >
                {(Array.isArray(DUMMY_TEMPLATES[item.section.id]) ? DUMMY_TEMPLATES[item.section.id] : []).map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => removeSection(item.section.id)}
              className="text-red-500 hover:text-red-700 font-bold text-lg"
              title="Quitar sección"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SectionsSection;