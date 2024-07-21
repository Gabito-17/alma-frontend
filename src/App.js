// src/App.js
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Personas from "./pages/Pacientes";
import Psicologos from "./pages/Psicologos";
import Sexos from "./pages/Sexos";
import TipoDocumentos from "./pages/TipoDocumentos";
import EspecialidadesForm from "./pages/Especialidad"; 
import PaisesForm from "./pages/Paises";

function App() {
  return (
    <Router>
      <div className="relative">
        {/* Navbar */}
        <Navbar />

        {/* Sidebar */}
        <Sidebar />

        {/* Contenido principal */}
        <div className="ml-32 pt-16">
          {" "}
          {/* Ajusta el margen izquierdo para evitar superposiciones */}
          <div className="ml-32 flex-grow p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/psicologos" element={<Psicologos />} />
              <Route path="/pacientes" element={<Personas />} />
              <Route path="/parametros/sexo" element={<Sexos />} />
              <Route path="/parametros/pais" element={<PaisesForm />} />
              <Route path="/parametros/especialidad" element={<EspecialidadesForm />} />
              <Route
                path="/parametros/tipo-documento"
                element={<TipoDocumentos />}
              />
              {/* Agrega más rutas según sea necesario */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
