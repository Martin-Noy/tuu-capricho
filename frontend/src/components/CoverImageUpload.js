import React from 'react';

function CoverImageUpload({ coverImage, coverImagePreview, onChange }) {
  return (
    <div>
      <label className="block font-semibold mb-2">Imagen de carátula</label>
      <input type="file" accept="image/*" onChange={onChange} />
      {coverImagePreview && (
        <img
          src={coverImagePreview}
          alt="Previsualización"
          className="mt-2 max-w-xs rounded shadow"
        />
      )}
      {coverImage && <p className="text-sm text-gray-500 mt-1">{coverImage.name}</p>}
    </div>
  );
}

export default CoverImageUpload;