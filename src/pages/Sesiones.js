import axios from "axios";
import React, { useEffect, useState } from "react";

const Sesiones = () => {
  const [sesiones, setSesiones] = useState([]);
  const [formData, setFormData] = useState({
    fechaHora: "",
    idPaciente: "",
    idPsicologo: "",
  });
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    // Fetch initial data
    fetchSesiones();
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

  const fetchSesiones = async () => {
    try {
      const response = await axios.get("http://localhost:4000/sesiones");
      const sesionesConFormato = response.data.map((sesion) => ({
        ...sesion,
        fechaHora: new Date(sesion.fechaHora).toLocaleString(), // Convertir a formato legible
      }));
      setSesiones(sesionesConFormato);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Si el campo que cambió es el paciente
    if (name === "idPaciente") {
      const selectedPaciente = pacientes.find(
        (paciente) => paciente.id === parseInt(value)
      );
      console.log(selectedPaciente.psicologoAsignado);

      // Si se encuentra el paciente, actualizar el idPsicologo en formData
      if (selectedPaciente) {
        setFormData({
          ...formData,
          [name]: value, // Actualizar idPaciente
          idPsicologo: selectedPaciente.psicologoAsignado.id, // Asignar idPsicologo correspondiente
        });
      }
    } else {
      // Si no es el campo idPaciente, actualizar normalmente
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        idPaciente: parseInt(formData.idPaciente),
        idPsicologo: parseInt(formData.idPsicologo),
        fechaHora: new Date(formData.fechaHora).toISOString(),
      };
      if (editing) {
        console.log(formData);

        await axios.patch(
          `http://localhost:4000/sesiones/${formData.nroSesion}`,
          submitData
        );
        alert("Sesion actualizada");
      } else {
        console.log(formData);
        await axios.post("http://localhost:4000/sesiones", submitData);
        alert("Sesion creada");
      }
      setFormData({
        fechaHora: "",
        estado: "",
        idPaciente: "",
        idPsicologo: "",
      });
      fetchSesiones();
      setEditing(false); // Resetear el modo de edición
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : error.message;
      alert(`Error: ${errorMessage}`);
      console.error("Error al crear la Sesion:", errorMessage);
    }
  };

  const onEdit = (sesion) => {
    // Convertir la fecha y hora al formato requerido por el input datetime-local
    const formattedFechaHora = new Date(sesion.fechaHora)
      .toISOString()
      .slice(0, 16); // `YYYY-MM-DDTHH:MM`
    setEditing(true);
    setFormData({
      ...sesion,
      fechaHora: formattedFechaHora,
      idPaciente: sesion.paciente.id,
      idPsicologo: sesion.psicologo.id,
    });
    console.log(sesion);
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
      fechaHora: "",
      estado: "",
      idPaciente: "",
      idPsicologo: "",
    });
    setEditing(false);
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
        </h2>{" "}
        <div className="mb-4 flex flex-row m-4">
          <div className="basis-1/2 p-2">
            <label className="block text-gray-700  mb-2 ">*Paciente:</label>
            <select
              name="idPaciente"
              value={formData.idPaciente}
              onChange={handleInputChange}
              disabled={editing}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option hidden>Seleccionar</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.nombre + " " + paciente.apellido}
                </option>
              ))}
            </select>
          </div>
          <div className="basis-1/2 p-2">
            <label className="block text-gray-700 mb-2">*Fecha y Hora:</label>
            <input
              disabled={formData.estado === "Cancelado"}
              type="datetime-local"
              name="fechaHora"
              value={formData.fechaHora}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
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
                        if (
                          window.confirm(
                            "¿Estás seguro de que deseas editar esta sesión?"
                          )
                        ) {
                          onEdit(sesion);
                        }
                      }}
                      className={`py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2 ${
                        sesion.estado !== "Pendiente"
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed" // Estilos para el botón deshabilitado
                          : "bg-blue-500 hover:bg-blue-700 text-white"
                      }`}
                      disabled={sesion.estado !== "Pendiente"}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "¿Estás seguro de que deseas cancelar esta sesión?"
                          )
                        ) {
                          onDelete(sesion.nroSesion);
                        }
                      }}
                      className={`py-1 px-2 rounded focus:outline-none focus:shadow-outline" ${
                        sesion.estado !== "Pendiente"
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed" // Estilos para el botón deshabilitado
                          : "bg-red-500 hover:bg-red-700 text-white"
                      }`}
                      disabled={sesion.estado !== "Pendiente"}
                    >
                      Cancelar
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
