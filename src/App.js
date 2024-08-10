// src/App.js
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Personas from "./pages/Pacientes";
import Especialidad from "./pages/parametros/Especialidad";
import TipoDocumentos from "./pages/parametros/TipoDocumentos";
import Psicologos from "./pages/Psicologos";
import Sesiones from "./pages/Sesiones";
import EstadoCivil from "./pages/parametros/EstadoCivil";
import Secretarios from "./pages/Secretarios";
import Ocupacion from "./pages/parametros/Ocupacion";
import InformeSesion from "./pages/InformeSesion";

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
              <Route path="/sesiones" element={<Sesiones />} />
              <Route path="/secretarios" element={<Secretarios />} />
              <Route path="/informeSesion" element={<InformeSesion />} />
              <Route
                path="/parametros/especialidad"
                element={<Especialidad />}
              />
              <Route
                path="/parametros/tipo-documento"
                element={<TipoDocumentos />}
              /> <Route
              path="/parametros/estado-civil"
              element={<EstadoCivil />}
            />
              <Route
              path="/parametros/ocupacion"
              element={<Ocupacion />}
            />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
