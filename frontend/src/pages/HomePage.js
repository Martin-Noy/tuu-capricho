// frontend/src/pages/HomePage.js
import React from 'react';
import { BookOpen } from 'lucide-react'; // Icons

const HomePage = ({ onCustomizeClick }) => {
  return (
    <section className="text-center py-12">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
        Bienvenida a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Tuu Capricho</span>
      </h2>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
        Crea la agenda de tus sueños, única y perfecta para ti. ¡Personaliza cada detalle!
      </p>

      {/* Gallery of pre-made products (mock) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
          <img
            src="https://placehold.co/400x300/F0F8FF/333333?text=Agenda+Romántica"
            alt="Agenda Romántica"
            className="w-full h-48 object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/F0F8FF/333333?text=Imagen+no+disponible"; }}
          />
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Agenda "Sueños Rosas"</h3>
            <p className="text-gray-600 mb-4">
              Una agenda con diseños florales y tonos pastel. Perfecta para amantes de lo romántico.
            </p>
            <span className="text-lg font-semibold text-purple-600">$4500 ARS</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
          <img
            src="https://placehold.co/400x300/FFF0F5/333333?text=Agenda+Minimalista"
            alt="Agenda Minimalista"
            className="w-full h-48 object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/FFF0F5/333333?text=Imagen+no+disponible"; }}
          />
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Agenda "Esencia Simple"</h3>
            <p className="text-gray-600 mb-4">
              Diseño limpio y funcional, ideal para quienes buscan simplicidad y organización.
            </p>
            <span className="text-lg font-semibold text-purple-600">$4200 ARS</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
          <img
            src="https://placehold.co/400x300/F5F5DC/333333?text=Agenda+Creativa"
            alt="Agenda Creativa"
            className="w-full h-48 object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/F5F5DC/333333?text=Imagen+no+disponible"; }}
          />
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Agenda "Explosión de Color"</h3>
            <p className="text-gray-600 mb-4">
              Una explosión de colores vibrantes y patrones divertidos para inspirarte cada día.
            </p>
            <span className="text-lg font-semibold text-purple-600">$4800 ARS</span>
          </div>
        </div>
      </div>

      <button
        onClick={onCustomizeClick}
        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xl rounded-full shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 duration-300 flex items-center justify-center mx-auto"
      >
        <BookOpen className="mr-3" size={28} />
        Personaliza Tu Propia Agenda
      </button>
    </section>
  );
};

export default HomePage;