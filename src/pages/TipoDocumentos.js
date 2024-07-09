import axios from "axios";
import React, { useEffect, useState } from "react";

const TipoDocumentosForm = () => {
  const [tipoDocumentos, setTipoDocumentos] = useState([]);
  const [filteredTipoDocumentos, setFilteredTipoDocumentos] = useState([]);
  const [formData, setFormData] = useState({
    sigla: "",
    descripcion: "",
  });
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    // Fetch initial data
    fetchTipoDocumentos();
  }, []);

  useEffect(() => {
    setFilteredTipoDocumentos(
      tipoDocumentos.filter((tipoDocumento) =>
        tipoDocumento.sigla.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, tipoDocumentos]);

  const fetchTipoDocumentos = async () => {
    try {
      const response = await axios.get("http://localhost:4000/tipoDocumentos");
      setTipoDocumentos(response.data);
      setFilteredTipoDocumentos(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "sigla") {
      checkTipoDocumentoExists(e.target.value);
    }
  };

  const checkTipoDocumentoExists = (sigla) => {
    const exists = tipoDocumentos.some(
      (tipoDocumento) =>
        tipoDocumento.sigla === sigla &&
        tipoDocumento.idTipoDocumento !== formData.idTipoDocumento
    );
    if (exists) {
      setError("El tipo de documento ya existe.");
      setIsButtonDisabled(true);
    } else {
      setError("");
      setIsButtonDisabled(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editing) {
      // Update tipoDocumento
      try {
        await axios.patch(
          `http://localhost:4000/tipoDocumentos/${formData.idTipoDocumento}`,
          {
            sigla: formData.sigla,
            descripcion: formData.descripcion,
          }
        );
        setEditing(false);
        fetchTipoDocumentos();
      } catch (error) {
        console.error("Error updating data:", error);
      }
    } else {
      // Create new tipoDocumento
      try {
        await axios.post("http://localhost:4000/tipoDocumentos", formData);
        fetchTipoDocumentos();
      } catch (error) {
        console.error("Error creating data:", error);
      }
    }
    setFormData({ idTipoDocumento: null, sigla: "", descripcion: "" });
  };

  const handleEdit = (tipoDocumento) => {
    setFormData(tipoDocumento);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/tipoDocumentos/${id}`);
      fetchTipoDocumentos();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleCancel = () => {
    setFormData({ idTipoDocumento: null, sigla: "", descripcion: "" });
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
          {editing
            ? "Modificando Tipo de Documento"
            : "Registrando Tipo de Documento"}
        </h2>
        <div className="mb-4 flex">
          <div className="w-1/5 pr-2">
            <label className="block text-gray-700 mb-2">Sigla</label>
            <input
              type="text"
              name="sigla"
              value={formData.sigla}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
          </div>
          <div className="w-2/3 pl-2">
            <label className="block text-gray-700 mb-2">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded mr-2"
          >
            Limpiar Campos
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={isButtonDisabled}
          >
            {editing
              ? "Modificar Tipo de Documento"
              : "Agregar Tipo de Documento"}
          </button>
        </div>
      </form>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tipos de Documentos</h2>
        <input
          type="text"
          placeholder="Filtrar por Sigla"
          value={filter}
          onChange={handleFilterChange}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border">idTipoDocumento</th>
              <th className="px-4 py-2 border">Sigla</th>
              <th className="px-4 py-2 border">Descripción</th>
              <th className="px-4 py-2 border">Editar</th>
              <th className="px-4 py-2 border">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {filteredTipoDocumentos.map((tipoDocumento) => (
              <tr key={tipoDocumento.idTipoDocumento}>
                <td className="px-4 py-2 border">
                  {tipoDocumento.idTipoDocumento}
                </td>
                <td className="px-4 py-2 border">{tipoDocumento.sigla}</td>
                <td className="px-4 py-2 border">
                  {tipoDocumento.descripcion}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(tipoDocumento)}
                    className="text-blue-500 hover:underline"
                  >
                    Editar
                  </button>
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleDelete(tipoDocumento.idTipoDocumento)}
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

export default TipoDocumentosForm;
