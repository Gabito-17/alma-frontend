import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const InformeSesion = () => {
  const { nroSesion } = useParams();
  const navigate = useNavigate();
  const [informes] = useState([]);
  const [formData, setFormData] = useState({
    nroSesion: parseInt(nroSesion) || 0, // Convierte nroSesion a entero
    tipoDescripcion: "",
    descripcion: "",
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    // Fetch informe data when nroSesion changes
    const fetchInformeData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/informes/${nroSesion}`
        );
        const informe = response.data;
        if (!informe) {
          return;
        }

        // Update formData with the fetched data
        setFormData({
          nroSesion: informe.sesion.nroSesion,
          tipoDescripcion: informe.tipoDescripcion,
          descripcion: informe.descripcion,
        });

        setEditing(true); // Set editing mode to true since we're fetching existing data
      } catch (error) {}
    };

    if (nroSesion) {
      fetchInformeData();
    }
  }, [nroSesion]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "tipoDescripcion") {
      checkInformeExists(value);
    }
  };

  const checkInformeExists = (tipo) => {
    const exists = informes.some(
      (informe) =>
        informe.tipoDescripcion === tipo && informe.id !== formData.id
    );
    if (exists) {
      setError("El tipo de informe ya existe.");
      setIsButtonDisabled(true);
    } else {
      setError("");
      setIsButtonDisabled(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.patch(
          `http://localhost:4000/informes/${nroSesion}`,
          formData
        );
        alert("Informe de Sesión actualizado con éxito");
      } else {
        await axios.post("http://localhost:4000/informes", formData);
        alert("Informe de Sesión creado con éxito");
      }
      navigate(`/informes/${nroSesion}`);
    } catch (error) {
      alert(error.response.data.message);
      console.error("Error creating or updating data:", error);
    }

    setFormData({
      tipoDescripcion: "",
      descripcion: "",
      nroSesion: parseInt(nroSesion) || 0, // Asegúrate de mantener nroSesion como entero
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      tipoDescripcion: "",
      descripcion: "",
      nroSesion: parseInt(nroSesion) || 0, // Mantén el nroSesion como entero
    });
    setEditing(false);
    setError("");
    setIsButtonDisabled(false);
  };

  return (
    <div className="container mx-auto p-1">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-full"
      >
        <h2 className="text-xl font-bold mb-4">
          {editing ? "Modificando Informe" : "Registrando Informe"}
        </h2>
        <div className="mb-4 flex flex-col space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">
              Tipo de Descripción:
            </label>
            <input
              type="text"
              name="tipoDescripcion"
              value={formData.tipoDescripcion}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Descripción:</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                className="bg-red-300 hover:bg-red-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancelar Edición
              </button>
              <button
                type="submit"
                disabled={isButtonDisabled}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Guardar
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-400 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Limpiar Campos
              </button>
              <button
                type="submit"
                disabled={isButtonDisabled}
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Registrar Informe
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default InformeSesion;
