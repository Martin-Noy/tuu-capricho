// frontend/src/App.js
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CustomizeAgendaPage from './pages/CustomizeAgendaPage';

function App() {
  const location = useLocation();

  const navButtonClass = (isActive) =>
    `px-4 py-2 rounded-lg text-lg font-semibold transition-all
    ${isActive
      ? 'text-purple-600 bg-purple-50'
      : 'text-gray-600 hover:text-purple-600'}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 font-inter text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center rounded-b-xl">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2 sm:mb-0">
          Tuu Capricho
        </h1>
        <nav aria-label="Navegación principal">
          <Link
            to="/"
            className={navButtonClass(location.pathname === '/')}
            aria-current={location.pathname === '/' ? 'page' : undefined}
          >
            Inicio
          </Link>
          <Link
            to="/customize"
            className={navButtonClass(location.pathname === '/customize')}
            aria-current={location.pathname === '/customize' ? 'page' : undefined}
          >
            Personaliza tu Agenda
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 lg:p-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customize" element={<CustomizeAgendaPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;