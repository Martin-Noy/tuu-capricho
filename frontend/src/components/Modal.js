// frontend/src/components/Modal.js
import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X size={24} />
        </button>
        {title && <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;