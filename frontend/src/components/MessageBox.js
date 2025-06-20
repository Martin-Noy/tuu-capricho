// frontend/src/components/MessageBox.js
import React from 'react';
import { createPortal } from 'react-dom';

const MessageBox = ({ message, type, onClose }) => {
  if (!message) return null;

  const typeClasses = {
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    error: 'bg-red-100 border-red-400 text-red-700',
  };

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className={`rounded-xl shadow-lg p-6 relative max-w-sm w-full border ${typeClasses[type] || typeClasses.info} animate-scale-in`}>
        <p className="text-lg font-medium text-center">{message}</p>
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:from-pink-500 hover:to-purple-600 transition-all transform hover:scale-105"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MessageBox;