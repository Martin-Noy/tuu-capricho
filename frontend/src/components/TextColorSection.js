import React from 'react';

function TextColorSection({ textColor, setTextColor }) {
  return (
    <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
      <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
        3. Color de Texto
      </h3>
      <p className="text-gray-600 mb-4">Selecciona el color de texto para el contenido de tus secciones.</p>
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={textColor}
          onChange={e => setTextColor(e.target.value)}
          className="w-12 h-12 border-2 border-blue-300 rounded"
        />
        <span className="ml-2 font-semibold" style={{ color: textColor }}>{textColor}</span>
      </div>
    </div>
  );
}

export default TextColorSection;