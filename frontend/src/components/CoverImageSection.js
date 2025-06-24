import React from 'react';
import CoverImageUpload from './CoverImageUpload';

function CoverImageSection({ coverImage, coverImagePreview, onChange }) {
  return (
    <div className="mb-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
      <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
        1. Carátula de la Agenda
      </h3>
      <p className="text-gray-600 mb-4">Sube una imagen para la tapa de tu agenda.</p>
      <CoverImageUpload
        coverImage={coverImage}
        coverImagePreview={coverImagePreview}
        onChange={onChange}
      />
    </div>
  );
}

export default CoverImageSection;