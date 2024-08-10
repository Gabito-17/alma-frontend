import axios from "axios";
import React, { useEffect, useState } from "react";

const TipoDocumentos = () => {
  const [tipoDocumentos, setTipoDocumentos] = useState([]);
  const [formData, setFormData] = useState({
    idTipoDocumento: "",
    sigla: "",
    descripcion: "",
    cantDigitos: "",
    admiteLetras: false,
  });
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    // Fetch initial data
    fetchTipoDocumentos();
  }, []);

  const fetchTipoDocumentos = async () => {
    try {
      const response = await axios.get("http://localhost:4000/tipo-documentos");
      setTipoDocumentos(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "sigla") {
      checkTipoDocumentoExists(value);
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
          `http://localhost:4000/tipo-documentos/${formData.idTipoDocumento}`,
          {
            sigla: formData.sigla,
            descripcion: formData.descripcion,
            cantDigitos: formData.cantDigitos,
            admiteLetras: formData.admiteLetras,
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
        formData.cantDigitos = parseInt(formData.cantDigitos);
        await axios.post("http://localhost:4000/tipo-documentos", {
          sigla: formData.sigla,
          descripcion: formData.descripcion,
          cantDigitos: formData.cantDigitos,
          admiteLetras: formData.admiteLetras,
        });
        fetchTipoDocumentos();
      } catch (error) {
        console.error("Error creating data:", error);
      }
    }
    setFormData({
      idTipoDocumento: "",
      sigla: "",
      descripcion: "",
      cantDigitos: "",
      admiteLetras: false,
    });
  };

  const onEdit = (tipoDocumento) => {
    setFormData(tipoDocumento);
    setEditing(true);
  };

  const onDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/tipo-documentos/${id}`
      );
      if (response.data.status === 409) {
        alert(response.data.message);
      }
      fetchTipoDocumentos();
    } catch (error) {}
  };

  const handleCancel = () => {
    setFormData({
      idTipoDocumento: null,
      sigla: "",
      descripcion: "",
      cantDigitos: "",
      admiteLetras: false,
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
          {editing
            ? "Modificando Tipo de Documento"
            : "Registrando Tipo de Documento"}
        </h2>
        <div className="mb-4 flex">
          <div className="w-1/5 pr-2">
            <label className="block text-gray-700 mb-2">Sigla:</label>
            <input
              type="text"
              name="sigla"
              value={formData.sigla}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={editing}
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
          </div>{" "}
          <div className="w-2/8 pl-2">
            <label className="block text-gray-700 mb-2">
              Cantidad de digitos:
            </label>
            <input
              type="number"
              name="cantDigitos"
              value={formData.cantDigitos}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={editing}
            />
          </div>
          <div className="w-2/3 pl-2">
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
        <div className="w-2/6 pl-2">
          <label className="block text-gray-700 mb-2">Admite Letras?</label>
          <input
            type="checkbox"
            name="admiteLetras"
            checked={formData.admiteLetras}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-span-4 flex justify-end space-x-4">
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                className="bg-red-300 hover:bg-red-500 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancelar Edición
              </button>
              <button
                type="submit"
                disabled={isButtonDisabled}
                className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Guardar
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-400 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Limpiar Campos
              </button>
              <button
                type="submit"
                disabled={isButtonDisabled}
                className="bg-green-500 hover:bg-green-700 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Registrar Tipo Documento
              </button>
            </>
          )}
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
              <th className="px-4 py-2 border">Sigla</th>
              <th className="px-4 py-2 border">Descripción</th>
              <th className="px-4 py-2 border">Cantidad de digitos</th>
              <th className="px-4 py-2 border">admite letras?</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipoDocumentos.map((tipoDocumento) => (
              <tr key={tipoDocumento.idTipoDocumento}>
                <td className="px-4 py-2 border">{tipoDocumento.sigla}</td>
                <td className="px-4 py-2 border">
                  {tipoDocumento.descripcion}
                </td>
                <td className="px-4 py-2 border">
                  {tipoDocumento.cantDigitos}
                </td>
                <td className="px-4 py-2 border">
                  {tipoDocumento.admiteLetras ? "Sí" : "No"}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "¿Estás seguro de que deseas editar este tipo de documento?"
                        )
                      ) {
                        onEdit(tipoDocumento);
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
                          "¿Estás seguro de que deseas eliminar este tipo de documento?"
                        )
                      ) {
                        onDelete(tipoDocumento.idTipoDocumento);
                      }
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white  py-1 px-2 rounded"
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

export default TipoDocumentos;
