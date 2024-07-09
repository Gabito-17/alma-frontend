import axios from "axios";
import React, { useEffect, useState } from "react";

const PersonaForm = () => {
  const [formData, setFormData] = useState({
    numeroDoc: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    fechaDeNacimiento: "",
    mail: "",
    idTipoDocumento: "",
    idSexo: "",
    idPais: "",
  });

  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [paises, setPaises] = useState([]);

  const limpiarCampos = () => {
    setFormData({
      numeroDoc: "",
      nombre: "",
      apellido: "",
      telefono: "",
      direccion: "",
      fechaDeNacimiento: "",
      mail: "",
      idTipoDocumento: "",
      idSexo: "",
      idPais: "",
    });
  };

  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const onDelete = async (persona) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/personas/${persona.numeroDoc}`
      );
      console.log("Persona eliminada:", response.data);
      fetchPersonas();
    } catch (error) {
      console.error(
        "Error al eliminar la persona:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const onEdit = (persona) => {
    setFormData({
      numeroDoc: persona.numeroDoc,
      nombre: persona.nombre,
      apellido: persona.apellido,
      telefono: persona.telefono,
      direccion: persona.direccion,
      fechaDeNacimiento: persona.fechaDeNacimiento,
      mail: persona.mail,
      idTipoDocumento: persona.tipoDocumento.idTipoDocumento,
      idSexo: persona.sexo.idSexo,
      idPais: persona.pais.idPais,
    });
  };

  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    fetchPersonas();
    fetchTiposDocumento();
    fetchSexos();
    fetchPaises();
  }, []);

  const fetchPersonas = async () => {
    try {
      const response = await axios.get("http://localhost:4000/personas");
      setPersonas(response.data);
    } catch (error) {
      console.error("Error al obtener las personas:", error);
    }
  };

  const fetchTiposDocumento = async () => {
    try {
      const response = await axios.get("http://localhost:4000/tipoDocumentos");
      setTiposDocumento(response.data);
    } catch (error) {
      console.error("Error al obtener los tipos de documento:", error);
    }
  };

  const fetchSexos = async () => {
    try {
      const response = await axios.get("http://localhost:4000/sexos");
      setSexos(response.data);
    } catch (error) {
      console.error("Error al obtener los sexos:", error);
    }
  };

  const fetchPaises = async () => {
    try {
      const response = await axios.get("http://localhost:4000/paises");
      setPaises(response.data);
    } catch (error) {
      console.error("Error al obtener los países:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/personas",
        formData
      );
      console.log("Persona creada:", response.data);
    } catch (error) {
      console.error(
        "Error al crear la persona:",
        error.response ? error.response.data : error.message
      );
    }
    fetchPersonas();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-md max-w-full mx-auto mt-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-left">
        Registrar un Paciente
      </h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Número de Documento:
          </label>
          <input
            type="text"
            name="numeroDoc"
            value={formData.numeroDoc}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Apellido:
          </label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Teléfono:
          </label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Dirección:
          </label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Fecha de Nacimiento:
          </label>
          <input
            type="date"
            name="fechaDeNacimiento"
            value={formData.fechaDeNacimiento}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Email:</label>
          <input
            type="email"
            name="mail"
            value={formData.mail}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Tipo de Documento:
          </label>
          <select
            name="idTipoDocumento"
            value={formData.idTipoDocumento}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Seleccionar Tipo de Documento</option>
            {tiposDocumento.map((tipo) => (
              <option key={tipo.idTipoDocumento} value={tipo.idTipoDocumento}>
                {tipo.sigla}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Sexo:</label>
          <select
            name="idSexo"
            value={formData.idSexo}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Seleccionar Sexo</option>
            {sexos.map((sexo) => (
              <option key={sexo.idSexo} value={sexo.idSexo}>
                {sexo.sexo}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">País:</label>
          <select
            name="idPais"
            value={formData.idPais}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Seleccionar País</option>
            {paises.map((pais) => (
              <option key={pais.idPais} value={pais.idPais}>
                {pais.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-4">
        <button
          type="button"
          onClick={limpiarCampos}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Limpiar Campos
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Registrar Persona
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6 text-left">Pacientes</h2>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="py-2 border"></th>
              <th className="py-2 border">DNI</th>
              <th className="py-2 border">Paciente</th>
              <th className="py-2 border">Telefono</th>
              <th className="py-2 border">Edad</th>
              <th className="py-2 border">País</th>
              <th className="py-2 border">Dirección</th>
              <th className="py-2 border">Editar</th>
              <th className="py-2 border">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {personas.map((persona) => (
              <tr key={persona.id} className="border-b dark:border-gray-700">
                <td className="border px-4 py-2">{}</td>
                <td className="border px-4 py-2">{persona.numeroDoc}</td>
                <td className="border px-4 py-2">
                  {persona.apellido + persona.nombre}
                </td>
                <td className="border px-4 py-2">{persona.telefono}</td>
                <td className="border px-4 py-2">
                  {calculateAge(persona.fechaDeNacimiento)}
                </td>
                <td className="border px-4 py-2">
                  {persona.fechaDeNacimiento}
                </td>
                <td className="border px-4 py-2">{persona.mail}</td>
                <td className="border px-4 py-2">
                  <button
                    className="text-blue-500 underline bg-transparent border-none cursor-pointer"
                    onClick={() => onEdit(persona)}
                  >
                    Editar
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button
                    className="text-red-500 underline bg-transparent border-none cursor-pointer"
                    onClick={() => onDelete(persona)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
};

export default PersonaForm;
