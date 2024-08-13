import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const InformeSesionSesion = () => {
  const { nroSesion } = useParams();
  const navigate = useNavigate();
  const [informe, setInforme] = useState(null); // Estado para guardar el informe

  useEffect(() => {
    if (nroSesion) {
      fetchInformeDetails(nroSesion);
    }
  }, [nroSesion]);

  const fetchInformeDetails = async (nroSesion) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/informes/${nroSesion}`
      );
      setInforme(response.data); // Guardar el informe en el estado
    } catch (error) {
      console.error("Error fetching informe details:", error);
    }
  };

  const onEdit = () => {
    const confirmEdit = window.confirm(
      "¿Estás seguro de que deseas editar el informe?"
    );

    if (confirmEdit) {
      navigate(`/cargar-informe/${nroSesion}`);
    }
  };

  if (!informe) {
    return (
      <div className="container mx-auto p-4">
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <p className="font-bold">Aviso</p>
          <p>El Informe de Sesión no Existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        Detalles del Informe de Sesión
      </h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <strong>Tipo:</strong> {informe.tipoDescripcion}
        </div>
        <div className="mb-4">
          <strong>Descripción:</strong> {informe.descripcion}
        </div>
        <div className="mb-4">
          <strong>Fecha y Hora Cargado:</strong>{" "}
          {new Date(informe.fechaHora).toLocaleString()}
        </div>
        <div className="mb-4">
          <strong>Número de Sesión:</strong> {informe.sesion.nroSesion}
        </div>
        <div className="mb-4">
          <strong>Psicólogo Asignado:</strong> {informe.sesion.psicologo.nombre}{" "}
          {informe.sesion.psicologo.apellido}
        </div>
        <div className="mb-4">
          <strong>Paciente:</strong> {informe.sesion.paciente.nombre}{" "}
          {informe.sesion.paciente.apellido}
        </div>
        <div className="mb-4">
          <strong>Estado de la Sesión:</strong> {informe.sesion.estado}
        </div>
        <button
          onClick={onEdit}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Editar Informe
        </button>
      </div>
    </div>
  );
};

export default InformeSesionSesion;
