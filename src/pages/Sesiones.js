import axios from "axios";
import React, { useEffect, useState } from "react";

const Sesiones = () => {
  const [sesiones, setSesiones] = useState([]);
  const [formData, setFormData] = useState({
    idSesion: "",
    fechaHora: "",
    estado: "",
    idPaciente: "",
    idPsicologo: "",
  });
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [psicologos, setPsicologos] = useState([]);
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    // Fetch initial data
    fetchSesiones();
    fetchPsicologos();
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    try {
      const response = await axios.get("http://localhost:4000/pacientes");
      setPacientes(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPsicologos = async () => {
    try {
      const response = await axios.get("http://localhost:4000/psicologos");
      setPsicologos(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchSesiones = async () => {
    try {
      const response = await axios.get("http://localhost:4000/sesiones");
      setSesiones(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "fechaHora") {
      checkSesionExists(value);
    }
  };

  const checkSesionExists = (fechaHora) => {
    const exists = sesiones.some(
      (sesion) =>
        sesion.fechaHora === fechaHora && sesion.idSesion !== formData.idSesion
    );
    if (exists) {
      setError("La sesión ya existe.");
      setIsButtonDisabled(true);
    } else {
      setError("");
      setIsButtonDisabled(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editing) {
      // Update sesion
      try {
        await axios.patch(
          `http://localhost:4000/sesiones/${formData.idSesion}`,
          {
            fechaHora: formData.fechaHora,
            estado: formData.estado,
            idPaciente: formData.idPaciente,
            idPsicologo: formData.idPsicologo,
          }
        );
        setEditing(false);
        fetchSesiones();
      } catch (error) {
        console.error("Error updating data:", error);
      }
    } else {
      // Create new sesion
      try {
        await axios.post("http://localhost:4000/sesiones", formData);
        fetchSesiones();
      } catch (error) {
        console.error("Error creating data:", error);
      }
    }
    setFormData({
      idSesion: "",
      fechaHora: "",
      estado: "",
      idPaciente: "",
      idPsicologo: "",
    });
  };

  const onEdit = (sesion) => {
    setFormData(sesion);
    setEditing(true);
  };

  const onDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/sesiones/${id}`);
      fetchSesiones();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      idSesion: "",
      fechaHora: "",
      estado: "",
      idPaciente: "",
      idPsicologo: "",
    });
    setEditing(false);
    setError("");
    setIsButtonDisabled(false);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-4"
      >
        <h2 className="text-xl font-bold mb-4">
          {editing ? "Modificando Sesión" : "Registrando Sesión"}
        </h2>
        <div className="mb-4 flex">
          <div className="w-1/2 pr-2">
            <label className="block text-gray-700 mb-2">Fecha y Hora:</label>
            <input
              type="datetime-local"
              name="fechaHora"
              value={formData.fechaHora}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="w-1/2 pl-2">
            <label className="block text-gray-700 mb-2">Estado:</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Seleccione un estado</option>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="REALIZADA">REALIZADA</option>
              <option value="CANCELADA">CANCELADA</option>
            </select>
          </div>
        </div>
        <div className="mb-4 col-span-2">
          <label className="block text-gray-700  mb-2 ">*Paciente:</label>
          <select
            name="idPaciente"
            value={formData.idPaciente}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option hidden>Seleccionar</option>
            {pacientes.map((paciente) => (
              <option key={paciente.id} value={String(paciente.id)}>
                {paciente.nombre + " " + paciente.apellido}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4 flex">
          <div className="mb-4 col-span-2">
            <label className="block text-gray-700  mb-2 ">*Psicologo:</label>
            <select
              name="idPsicologo"
              value={formData.idPsicologo}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option hidden>Seleccionar</option>
              {psicologos.map((psicologo) => (
                <option key={psicologo.id} value={String(psicologo.id)}>
                  {psicologo.nombre + " " + psicologo.apellido}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-span-4 flex justify-end space-x-4">
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
                Registrar Sesión
              </button>
            </>
          )}
        </div>
      </form>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Sesiones</h2>
        <input
          type="text"
          placeholder="Filtrar por Estado"
          value={filter}
          onChange={handleFilterChange}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Fecha y Hora</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Paciente</th>
              <th className="px-4 py-2 border">Psicólogo</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sesiones
              .filter((sesion) =>
                sesion.estado.toLowerCase().includes(filter.toLowerCase())
              )
              .map((sesion) => (
                <tr key={sesion.idSesion}>
                  <td className="px-4 py-2 border">{sesion.fechaHora}</td>
                  <td className="px-4 py-2 border">{sesion.estado}</td>
                  <td className="px-4 py-2 border">{sesion.idPaciente}</td>
                  <td className="px-4 py-2 border">{sesion.idPsicologo}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "¿Estás seguro de que deseas editar esta sesión?"
                          )
                        ) {
                          onEdit(sesion);
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "¿Estás seguro de que deseas eliminar esta sesión?"
                          )
                        ) {
                          onDelete(sesion.idSesion);
                        }
                      }}
                      className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      Eliminar
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

export default Sesiones;
