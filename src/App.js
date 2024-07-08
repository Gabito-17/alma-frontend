// src/App.js
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Personas from './pages/Personas';

function App() {
  return (

    <Router>
      <div className="relative">
    {/* Navbar */}
    <Navbar />

    {/* Sidebar */}
    <Sidebar />

    {/* Contenido principal */}
    <div className="ml-64 pt-16"> {/* Ajusta el margen izquierdo para evitar superposiciones */}
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-grow p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pacientes" element={<Personas />} />
            <Route path="/psicologos" element={<Personas />} />
            <Route path="/parametros/sexo" element={<Personas />} />
            <Route path="/parametros/pais" element={<Personas />} />
            <Route path="/parametros/tipo-documento" element={<Personas />} />
            {/* Agrega más rutas según sea necesario */}
          </Routes>
        </div>
      </div>
      </div>
      </div>
    </Router>
  );
}

export default App;
