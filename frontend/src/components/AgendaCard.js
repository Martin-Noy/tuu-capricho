import React from 'react';

function AgendaCard({ img, alt, title, desc, price }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl duration-300">
      <img
        src={img}
        alt={alt}
        className="w-full h-48 object-cover"
        onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/EEE/333?text=Imagen+no+disponible"; }}
      />
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{desc}</p>
        <span className="text-lg font-semibold text-purple-600">{price}</span>
      </div>
    </div>
  );
}

export default AgendaCard;