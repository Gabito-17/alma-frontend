import axios from "axios";
import React, { useEffect, useState } from "react";

const SexosForm = () => {
  const [sexos, setSexos] = useState([]);
  const [formData, setFormData] = useState({ sexo: "" });
  const [editing, setEditing] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // Fetch datos iniciales
    fetchSexos();
  }, []);

  const fetchSexos = async () => {
    try {
      const response = await axios.get("http://localhost:4000/sexos");
      setSexos(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/sexos",
        formData
      );
      console.log("Sexo creado:", response.data);
    } catch (error) {
      console.error(
        "Error al crear sexo:",
        error.response ? error.response.data : error.message
      );
    }
    fetchSexos();
  };

  const handleEdit = (sexo) => {
    setFormData(sexo);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/sexos/${id}`);
      fetchSexos();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleCancel = () => {
    setFormData({ idSexo: "", sexo: "" });
    setEditing(false);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredSexos = sexos.filter((sexo) =>
    sexo.sexo.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sexo</h1>
      <div className="mb-4">
        <button
          onClick={fetchSexos}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Obtener Sexos
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-4"
      >
        <h2 className="text-xl font-bold mb-4">Modificar Sexo</h2>
        <div className="mb-4 flex">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 ">idSexo</label>
            <input
              type="text"
              name="idSexo"
              value={formData.idSexo}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              name="sexo"
              value={formData.sexo}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
          >
            Cancelar cambios
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editing ? "Modificar Sexo" : "Agregar Sexo"}
          </button>
        </div>
      </form>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Filtrar Sexos</h2>
        <input
          type="text"
          placeholder="Filtrar por Nombre"
          value={filter}
          onChange={handleFilterChange}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <h2 className="text-xl font-bold mb-4">Sexos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border">idSexo</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Editar</th>
              <th className="px-4 py-2 border">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {filteredSexos.map((sexo) => (
              <tr key={sexo.idSexo}>
                <td className="px-4 py-2 border">{sexo.idSexo}</td>
                <td className="px-4 py-2 border">{sexo.sexo}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(sexo)}
                    className="text-blue-500 hover:underline"
                  >
                    Editar
                  </button>
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleDelete(sexo.idSexo)}
                    className="text-red-500 hover:underline"
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

export default SexosForm;
