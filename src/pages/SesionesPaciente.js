import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SesionesPaciente = () => {
  const { idPaciente } = useParams();
  const [sesiones, setSesiones] = useState([]);
  const [filter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (idPaciente) {
      fetchSesionesPaciente(idPaciente);
    }
  }, [idPaciente]);

  const fetchSesionesPaciente = async (idPaciente) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/sesiones/${idPaciente}`
      );
      console.log("Datos de sesiones:", response.data);
      const sesionesConFormato = response.data.map((sesion) => ({
        ...sesion,
        fechaHora: new Date(sesion.fechaHora).toLocaleString(),
      }));
      console.log(sesionesConFormato);
      setSesiones(sesionesConFormato);
    } catch (error) {
      // Verifica si el error es 404 y maneja la redirección adecuadamente
      if (error.response && error.response.status === 404) {
        console.log("Este Paciente aún no tiene sesiones");
        alert("Este Paciente aún no tiene sesiones");
        navigate("/sesiones"); // Usar ruta relativa para redirigir
      } else {
        console.error("Error fetching sesiones:", error);
      }
    }
  };

  const onDetails = (nroSesion) => {
    navigate(`/informes/${nroSesion}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Fecha y Hora</th>
              <th className="px-4 py-2 border">Paciente</th>
              <th className="px-4 py-2 border">Psicólogo</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sesiones
              .filter((sesion) =>
                sesion.estado.toLowerCase().includes(filter.toLowerCase())
              )
              .map((sesion) => (
                <tr key={sesion.nroSesion}>
                  <td className="px-4 py-2 border">{sesion.fechaHora}</td>

                  <td className="px-4 py-2 border">
                    {sesion.paciente.nombre + " " + sesion.paciente.apellido}
                  </td>
                  <td className="px-4 py-2 border">
                    {sesion.psicologo.nombre + " " + sesion.psicologo.apellido}
                  </td>
                  <td className="px-4 py-2 border">{sesion.estado}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => {
                        if (sesion.estado === "Pendiente") {
                          // Redirigir a la pantalla para cargar el informe
                          navigate(`/cargar-informe/${sesion.nroSesion}`);
                        } else if (sesion.estado === "Realizado") {
                          // Redirigir a la pantalla para ver el informe
                          onDetails(sesion.nroSesion);
                        } else {
                          // Mostrar un mensaje o realizar alguna acción si es necesario
                          // Para el estado Cancelado y otros casos si es necesario
                        }
                      }}
                      className={`py-1 px-2 rounded focus:outline-none focus:shadow-outline ${
                        sesion.estado === "Pendiente"
                          ? "bg-green-500 hover:bg-green-600 text-white" // Verde para el estado Pendiente
                          : sesion.estado === "Realizado"
                          ? "bg-blue-500 hover:bg-blue-700 text-white" // Azul para el estado Realizado
                          : "bg-gray-300 text-gray-500 cursor-not-allowed" // Gris para el estado Cancelado y deshabilitado
                      }`}
                      disabled={sesion.estado === "Cancelado"} // Deshabilitar el botón si el estado es Cancelado
                    >
                      {sesion.estado === "Pendiente"
                        ? "Cargar Informe"
                        : sesion.estado === "Realizado"
                        ? "Ver Informe"
                        : "No Disponible"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SesionesPaciente;
