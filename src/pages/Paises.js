import axios from "axios";
import React, { useEffect, useState } from "react";

const PaisesForm = () => {
  const [paises, setPaises] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchPaises();
  }, []); // Fetch paises al cargar el componente

  const fetchPaises = async () => {
    try {
      const response = await axios.get("http://localhost:4000/paises");
      setPaises(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/paises/${id}`);
      fetchPaises();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const filteredPaises = paises.filter((pais) =>
    pais.nombre.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Países</h1>
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={fetchPaises}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Obtener Países
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Países</h2>
        <input
          type="text"
          placeholder="Filtrar por Sigla"
          value={filter}
          onChange={handleFilterChange}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="relative overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md mt-8">
          <thead>
            <tr>
              <th className="px-4 py-2 border">idPais</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {filteredPaises.map((pais) => (
              <tr key={pais.idPais}>
                <td className="px-4 py-2 border">{pais.idPais}</td>
                <td className="px-4 py-2 border">{pais.nombre}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleDelete(pais.idPais)}
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

export default PaisesForm;
