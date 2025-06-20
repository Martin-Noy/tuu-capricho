// frontend/src/pages/HomePage.js
import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import AgendaCard from '../components/AgendaCard';
import { AGENDAS } from '../data/constants';

const HomePage = () => {
  return (
    <section className="text-center py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
        Bienvenida a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Tuu Capricho</span>
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
        Crea la agenda de tus sueños, única y perfecta para ti. ¡Personaliza cada detalle!
      </p>

      {/* Galería de agendas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {AGENDAS.map((agenda, idx) => (
          <AgendaCard key={idx} {...agenda} />
        ))}
      </div>

      <Link
        to="/customize"
        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xl rounded-full shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95 duration-300 flex items-center justify-center mx-auto focus:outline-none focus:ring-4 focus:ring-pink-200"
        aria-label="Personaliza tu propia agenda"
      >
        <BookOpen className="mr-3" size={28} />
        Personaliza Tu Propia Agenda
      </Link>
    </section>
  );
};

export default HomePage;