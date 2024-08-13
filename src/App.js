// src/App.js
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import InformeSesion from "./pages/InformeSesion";
import InformeSesionSesion from "./pages/informeSesionSesion";
import Personas from "./pages/Pacientes";
import Especialidad from "./pages/parametros/Especialidad";
import EstadoCivil from "./pages/parametros/EstadoCivil";
import Ocupacion from "./pages/parametros/Ocupacion";
import TipoDocumentos from "./pages/parametros/TipoDocumentos";
import Psicologos from "./pages/Psicologos";
import Secretarios from "./pages/Secretarios";
import Sesiones from "./pages/Sesiones";
import SesionesPaciente from "./pages/SesionesPaciente";

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
          <div className="ml-16 flex-grow p-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/psicologos" element={<Psicologos />} />
              <Route path="/pacientes" element={<Personas />} />
              <Route path="/sesiones" element={<Sesiones />} />
              <Route
                path="/sesiones/:idPaciente"
                element={<SesionesPaciente />}
              />
              <Route path="/secretarios" element={<Secretarios />} />
              <Route
                path="/cargar-informe/:nroSesion"
                element={<InformeSesion />}
              />
              <Route
                path="/informes/:nroSesion"
                element={<InformeSesionSesion />}
              />
              <Route
                path="/parametros/especialidad"
                element={<Especialidad />}
              />
              <Route
                path="/parametros/tipo-documento"
                element={<TipoDocumentos />}
              />{" "}
              <Route
                path="/parametros/estado-civil"
                element={<EstadoCivil />}
              />
              <Route path="/parametros/ocupacion" element={<Ocupacion />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
