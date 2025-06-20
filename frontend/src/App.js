// frontend/src/App.js
import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import CustomizeAgendaPage from './pages/CustomizeAgendaPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'customize'

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 font-inter text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center rounded-b-xl">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
          Tuu Capricho
        </h1>
        <nav>
          <button
            onClick={() => setCurrentPage('home')}
            className={`mr-4 px-4 py-2 rounded-lg text-lg font-semibold transition-all ${currentPage === 'home' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600'}`}
          >
            Inicio
          </button>
          <button
            onClick={() => setCurrentPage('customize')}
            className={`px-4 py-2 rounded-lg text-lg font-semibold transition-all ${currentPage === 'customize' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600'}`}
          >
            Personaliza tu Agenda
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 lg:p-10">
        {currentPage === 'home' && <HomePage onCustomizeClick={() => setCurrentPage('customize')} />}
        {currentPage === 'customize' && <CustomizeAgendaPage />}
      </main>
    </div>
  );
}

export default App;