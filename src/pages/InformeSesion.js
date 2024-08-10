import axios from "axios";
import React, { useEffect, useState } from "react";

const InformeSesion = () => {
  const [informes, setInformes] = useState([]);
  const [formData, setFormData] = useState({
    tipo: "",
    descripcion: "",
  });
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    // Fetch initial data
    fetchInformes();
  }, []);

  const fetchInformes = async () => {
    try {
      const response = await axios.get("http://localhost:4000/informes");
      setInformes(response.data);
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

    if (name === "tipo") {
      checkInformeExists(value);
    }
  };

  const checkInformeExists = (tipo) => {
    const exists = informes.some(
      (informe) => informe.tipo === tipo && informe.id !== formData.id
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

    if (editing) {
      // Update informe
      try {
        await axios.patch(`http://localhost:4000/informes/${formData.id}`, {
          tipo: formData.tipo,
          descripcion: formData.descripcion,
        });
        setEditing(false);
        fetchInformes();
      } catch (error) {
        console.error("Error updating data:", error);
      }
    } else {
      // Create new informe
      try {
        await axios.post("http://localhost:4000/informes", formData);
        fetchInformes();
      } catch (error) {
        console.error("Error creating data:", error);
      }
    }
    setFormData({
      tipo: "",
      descripcion: "",
    });
  };

  const onEdit = (informe) => {
    setFormData(informe);
    setEditing(true);
  };

  const onDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/informes/${id}`);
      fetchInformes();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      tipo: "",
      descripcion: "",
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
          {editing ? "Modificando Informe" : "Registrando Informe"}
        </h2>
        <div className="mb-4 flex">
          <div className="w-1/2 pr-2">
            <label className="block text-gray-700 mb-2">Tipo de Descripción:</label>
            <input
              type="text"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={editing}
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
          </div>
          <div className="w-1/2 pl-2">
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
                Registrar Informe
              </button>
            </>
          )}
        </div>
      </form>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Informes de Sesiones</h2>
        <input
          type="text"
          placeholder="Filtrar por Tipo"
          value={filter}
          onChange={handleFilterChange}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Tipo</th>
              <th className="px-4 py-2 border">Descripción</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {informes
              .filter((informe) =>
                informe.tipo.toLowerCase().includes(filter.toLowerCase())
              )
              .map((informe) => (
                <tr key={informe.id}>
                  <td className="px-4 py-2 border">{informe.tipo}</td>
                  <td className="px-4 py-2 border">{informe.descripcion}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "¿Estás seguro de que deseas editar este informe?"
                          )
                        ) {
                          onEdit(informe);
                        }
                      }}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "¿Estás seguro de que deseas eliminar este informe?"
                          )
                        ) {
                          onDelete(informe.id);
                        }
                      }}
                      className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
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

export default InformeSesion;
