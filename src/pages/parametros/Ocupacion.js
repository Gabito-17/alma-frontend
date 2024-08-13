import axios from "axios";
import React, { useEffect, useState } from "react";

const Ocupacion = () => {
  const [ocupaciones, setocupaciones] = useState([]);
  const [formData, setFormData] = useState({
    idOcupacion: "",
    nombre: "",
    descripcion: "",
  });
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    // Fetch initial data
    fetchocupaciones();
  }, []);

  const fetchocupaciones = async () => {
    try {
      const response = await axios.get("http://localhost:4000/ocupaciones");
      setocupaciones(response.data);
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

    if (name === "nombre") {
      checkocupacionExists(value);
    }
  };

  const checkocupacionExists = (nombre) => {
    const exists = ocupaciones.some(
      (ocupacion) =>
        ocupacion.nombre === nombre &&
        ocupacion.idocupacion !== formData.idocupacion
    );
    if (exists) {
      setError("La ocupacion ya existe.");
      setIsButtonDisabled(true);
    } else {
      setError("");
      setIsButtonDisabled(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(editing);

    if (editing) {
      // Update ocupacion
      try {
        await axios.patch(
          `http://localhost:4000/ocupaciones/${formData.idOcupacion}`,
          {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
          }
        );
        setEditing(false);
        fetchocupaciones();
        alert("Ocupacion actualizada");
      } catch (error) {
        alert(error.response.data.message);
      }
    } else {
      // Create new ocupacion
      try {
        await axios.post("http://localhost:4000/ocupaciones", {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
        });
        fetchocupaciones();
      } catch (error) {
        alert(error.response.data.message);
        console.error("Error creating data:", error);
      }
    }
    setFormData({
      idOcupacion: "",
      nombre: "",
      descripcion: "",
    });
  };

  const onEdit = (ocupacion) => {
    setFormData(ocupacion);
    setEditing(true);
  };

  const onDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/ocupaciones/${id}`);
      fetchocupaciones();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      idocupacion: "",
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
          {editing ? "Modificando ocupacion" : "Registrando ocupacion"}
        </h2>
        <div className="mb-4 flex">
          <div className="w-1/2 pr-2">
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
          <div className="w-1/2 pl-2">
            <label className="block text-gray-700 mb-2">Descripción:</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
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
                Registrar ocupacion
              </button>
            </>
          )}
        </div>
      </form>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Ocupaciones de Pacientes</h2>
        <input
          type="text"
          placeholder="Filtrar por Nombre"
          value={filter}
          onChange={handleFilterChange}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <table className="bg-white p-8 rounded-lg shadow-md w-full max-w-full mx-auto h-full mt-8">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Nombre</th>
            <th className="px-4 py-2 border">Descripción</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ocupaciones
            .filter((ocupacion) =>
              ocupacion.nombre.toLowerCase().includes(filter.toLowerCase())
            )
            .map((ocupacion) => (
              <tr key={ocupacion.idOcupacion}>
                <td className="px-4 py-2 border">{ocupacion.nombre}</td>
                <td className="px-4 py-2 border">{ocupacion.descripcion}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "¿Estás seguro de que deseas editar esta ocupacion?"
                        )
                      ) {
                        onEdit(ocupacion);
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
                          "¿Estás seguro de que deseas eliminar esta ocupacion?"
                        )
                      ) {
                        onDelete(ocupacion.idOcupacion);
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
  );
};

export default Ocupacion;
