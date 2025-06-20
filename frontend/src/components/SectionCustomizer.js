import React from 'react';

function SectionCustomizer({ sections, onAdd, onRemove, onReorder }) {
  return (
    <div>
      <h3 className="font-bold mb-2">Secciones</h3>
      {/* Renderiza aquí la lista de secciones y botones para agregar/quitar/reordenar */}
      {/* Este es solo un esqueleto */}
      <ul>
        {sections.map((section, idx) => (
          <li key={section.id} className="mb-2">
            {section.name}
            <button onClick={() => onRemove(section.id)} className="ml-2 text-red-500">Quitar</button>
          </li>
        ))}
      </ul>
      <button onClick={onAdd} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Agregar sección</button>
    </div>
  );
}

export default SectionCustomizer;