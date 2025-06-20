import React from 'react';

function OrderButtons({ onPreview, onBuyPhysical, onBuyDigital }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-6">
      <button onClick={onPreview} className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold">Previsualizar Agenda</button>
      <button onClick={onBuyPhysical} className="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold">Comprar Agenda Física</button>
      <button onClick={onBuyDigital} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold">Comprar PDF Digital</button>
    </div>
  );
}

export default OrderButtons;