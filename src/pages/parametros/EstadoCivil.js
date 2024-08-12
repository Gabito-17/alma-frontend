import axios from "axios";
import React, { useEffect, useState } from "react";

const EstadoCivil = () => {
  const [estadoscivil, setEstadoscivil] = useState([]);
  const [formData, setFormData] = useState({
    idEstadoCivil: "",
    nombre: "",
    descripcion: "",
  });
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    // Fetch initial data
    fetchEstadoscivil();
  }, []);

  const fetchEstadoscivil = async () => {
    try {
      const response = await axios.get("http://localhost:4000/estado-civil");
      setEstadoscivil(response.data);
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

    if (name === "nombre") {
      checkEstadoCivilExists(value);
    }
  };

  const checkEstadoCivilExists = (nombre) => {
    const exists = estadoscivil.some(
      (estadoCivil) =>
        estadoCivil.nombre === nombre &&
        estadoCivil.idEstadoCivil !== formData.idEstadoCivil
    );
    if (exists) {
      setError("El estado civil ya existe.");
      setIsButtonDisabled(true);
    } else {
      setError("");
      setIsButtonDisabled(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editing) {
      // Update estado civil
      try {
        await axios.patch(
          `http://localhost:4000/estado-civil/${formData.idEstadoCivil}`,
          {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
          }
        );
        setEditing(false);
        fetchEstadoscivil();
        alert("EstadoCivil Actualizado");
      } catch (error) {
        console.error("Error updating data:", error);
        alert(error.response.data.message);
      }
    } else {
      // Crear nuevo estado civil
      try {
        await axios.post("http://localhost:4000/estado-civil", {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
        });
        fetchEstadoscivil();
      } catch (error) {
        if (error.response.status === 409) {
          alert(error.response.data.message);
        }
        console.error("Error creating data:", error);
      }
    }
    setFormData({
      idEstadoCivil: "",
      nombre: "",
      descripcion: "",
    });
  };

  const onEdit = (estadoCivil) => {
    setFormData(estadoCivil);
    setEditing(true);
  };

  const onDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/estado-civil/${id}`
      );

      if (response.status === 200) {
        alert(response.data.message);
      }

      fetchEstadoscivil();
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango de 2xx
        if (error.response.status === 409) {
          alert(error.response.data.message); // Muestra mensaje de conflicto
        } else if (error.response.status === 404) {
          alert(error.response.data.message); // Muestra mensaje de no encontrado
        } else {
          alert(
            "Error al eliminar el estado civil: " + error.response.data.message
          );
        }
      } else {
        // Ocurrió un error al configurar la solicitud
        console.error("Error deleting data:", error);
        alert("Error al eliminar el estado civil");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      idEstadoCivil: "",
      nombre: "",
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
          {editing ? "Modificando Estado Civil" : "Registrando Estado Civil"}
        </h2>
        <div className="mb-4 flex">
          <div className="pr-2 w-1/2">
            <label className="block text-gray-700 mb-2">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
          </div>
          <div className="pr-2 w-1/2">
            <label className="block text-gray-700 mb-2">Descripcion:</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
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
                Guardar Estado Civil
              </button>
            </>
          )}
        </div>
      </form>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Estados civil</h2>
        <input
          type="text"
          placeholder="Filtrar por Nombre"
          value={filter}
          onChange={handleFilterChange}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Descripcion</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estadoscivil
              .filter((estadoCivil) =>
                estadoCivil.nombre.toLowerCase().includes(filter.toLowerCase())
              )
              .map((estadoCivil) => (
                <tr key={estadoCivil.idEstadoCivil}>
                  <td className="px-4 py-2 border">{estadoCivil.nombre}</td>
                  <td className="px-4 py-2 border">
                    {estadoCivil.descripcion}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "¿Estás seguro de que deseas editar este estado civil?"
                          )
                        ) {
                          onEdit(estadoCivil);
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
                            "¿Estás seguro de que deseas eliminar este estado civil?"
                          )
                        ) {
                          onDelete(estadoCivil.idEstadoCivil);
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

export default EstadoCivil;
