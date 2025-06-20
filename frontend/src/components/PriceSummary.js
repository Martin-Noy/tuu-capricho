import React from 'react';

function PriceSummary({ totalPrice }) {
  return (
    <div className="text-right font-bold text-xl mt-4">
      Precio total estimado: <span className="text-green-600">${totalPrice}</span>
    </div>
  );
}

export default PriceSummary;