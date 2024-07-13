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
    TipoDocumento: "",
    Sexo: "",
    Pais: "",
  });

  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [paises, setPaises] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [erroresTexto, setErroresTexto] = useState({
    nombre: { vacio: false, contieneNumeros: false, contieneSimbolos: false },
    apellido: { vacio: false, contieneNumeros: false, contieneSimbolos: false },
    direccion: {
      vacio: false,
      contieneNumeros: false,
      contieneSimbolos: false,
    },
    mail: false,
    numeroDoc: { vacio: false, contieneLetras: false, contieneSimbolos: false },
  });
  const [fechaNacimientoError, setFechaNacimientoError] = useState(false);

  //Limpiar Campos del formulario
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

  //Calcular la edad de una persona
  const calcularEdad = (fechaDeNacimiento) => {
    const cumpleaños = new Date(fechaDeNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - cumpleaños.getFullYear();
    const diferenciaMes = hoy.getMonth() - cumpleaños.getMonth();
    if (
      diferenciaMes < 0 ||
      (diferenciaMes === 0 && hoy.getDate() < cumpleaños.getDate())
    ) {
      edad--;
    }

    return edad;
  };

  //Validar telefono
  const validarTelefono = (telefono) => {
    const longitudValida = telefono.length >= 7; //Minimo de 7 caracteres.
    const formatoValido = /^\d+$/.test(telefono); // Sin dígitos numéricos

    return longitudValida && formatoValido;
  };

  //Validar email
  const validarEmail = (email) => {
    // Expresión regular para validar el formato de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regexEmail.test(email)) {
      return true;
    } else {
      return false;
    }
  };

  //Validar un input que debe contener solo texto
  const validarTexto = (texto) => {
    const contieneNumeros = /\d/.test(texto);
    const contieneSimbolos = /[!@#$%^&*(),.?":{}|<>+-]/.test(texto);

    return {
      vacio: texto.trim() === "",
      contieneNumeros,
      contieneSimbolos,
    };
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
      idTipoDocumento: persona.idTipoDocumento,
      idSexo: persona.idSexo,
      idPais: persona.idPais,
    });
  };

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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "nombre" || name === "apellido" || name === "direccion") {
      const errores = validarTexto(value);
      setErroresTexto((prevErrores) => ({
        ...prevErrores,
        [name]: errores,
      }));
    }
    if (name === "telefono") {
      const esValido = validarTelefono(value);
      setErroresTexto((prevErrores) => ({
        ...prevErrores,
        telefono: !esValido,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "mail") {
      const esValido = validarEmail(value);
      setErroresTexto((prevErrores) => ({
        ...prevErrores,
        mail: !esValido,
      }));
    }
    if (name === "telefono") {
      const esValido = validarTelefono(value);
      setErroresTexto((prevErrores) => ({
        ...prevErrores,
        telefono: !esValido,
      }));
    }

    if (name === "nombre" || name === "apellido") {
      const errores = validarTexto(value);
      setErroresTexto((prevErrores) => ({
        ...prevErrores,
        [name]: errores,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (calcularEdad(formData.fechaDeNacimiento) < 18) {
      setFechaNacimientoError(true);
    } else {
      try {
        const response = await axios.post(
          "http://localhost:4000/personas",
          formData
        );
        console.log("Persona creada:", response.data);
        limpiarCampos();
        fetchPersonas();
      } catch (error) {
        console.error(
          "Error al crear Persona:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md max-w-full mx-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-left">
          Registrar un Paciente
        </h2>

        <div className="grid grid-cols-4 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Tipo de Documento:
            </label>
            <select
              name="tipoDocumento"
              value={formData.idTipoDocumento}
              onChange={handleChange}
              onBlur={handleBlur}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="" hidden>
                Seleccionar Tipo de Documento
              </option>
              {tiposDocumento.map((tipo) => (
                <option key={tipo.idTipoDocumento} value={tipo.idTipoDocumento}>
                  {tipo.sigla}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Número de Documento:
            </label>
            <p id="nroDocumento-error" className="text-red-500 text-sm mt-1">
              {" "}
              anda
            </p>
            <input
              type="text"
              name="numeroDoc"
              value={formData.numeroDoc}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Nombre:
            </label>
            {erroresTexto.nombre.vacio && (
              <p className="text-red-500 text-sm mt-1">
                El nombre no puede estar vacío.
              </p>
            )}
            {erroresTexto.nombre.contieneNumeros && (
              <p className="text-red-500 text-sm mt-1">
                El nombre no puede contener números.
              </p>
            )}
            {erroresTexto.nombre.contieneSimbolos && (
              <p className="text-red-500 text-sm mt-1">
                El nombre no puede contener símbolos.
              </p>
            )}
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Apellido:
            </label>
            {erroresTexto.apellido.vacio && (
              <p className="text-red-500 text-sm mt-1">
                El apellido no puede estar vacío.
              </p>
            )}
            {erroresTexto.apellido.contieneNumeros && (
              <p className="text-red-500 text-sm mt-1">
                El apellido no puede contener números.
              </p>
            )}
            {erroresTexto.apellido.contieneSimbolos && (
              <p className="text-red-500 text-sm mt-1">
                El apellido no puede contener símbolos.
              </p>
            )}
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              onBlur={handleBlur}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="fechaDeNacimiento"
            >
              Fecha de Nacimiento:
            </label>
            {fechaNacimientoError && (
              <p className="text-red-500 text-sm mt-1">
                Debe ser mayor de edad.
              </p>
            )}
            <input
              type="date"
              id="fechaDeNacimiento"
              name="fechaDeNacimiento"
              value={formData.fechaDeNacimiento}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">País:</label>

            <select
              name="pais"
              value={formData.idPais}
              onChange={handleChange}
              onBlur={handleBlur}
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

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Sexo:</label>
            <select
              name="sexo"
              value={formData.idSexo}
              onChange={handleChange}
              onBlur={handleBlur}
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
            <label className="block text-gray-700 font-bold mb-2">
              Dirección:
            </label>
            {erroresTexto.direccion.vacio && (
              <p className="text-red-500 text-sm mt-1">
                La direccion no puede estar vacío.
              </p>
            )}
            {erroresTexto.direccion.contieneNumeros && (
              <p className="text-red-500 text-sm mt-1">
                La direccion no puede contener números.
              </p>
            )}
            {erroresTexto.direccion.contieneSimbolos && (
              <p className="text-red-500 text-sm mt-1">
                La direccion no puede contener símbolos.
              </p>
            )}
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              onBlur={handleBlur}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Teléfono:
            </label>
            {erroresTexto.telefono && (
              <p className="text-red-500 text-sm mt-1">
                El teléfono debe contener al menos 7 dígitos numéricos.
              </p>
            )}
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              onBlur={handleBlur}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email:</label>
            {erroresTexto.mail && (
              <p className="text-red-500 text-sm mt-1">
                Por favor ingresa un correo electrónico válido.
              </p>
            )}
            <input
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              onBlur={handleBlur}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="col-span-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Guardar
            </button>
          </div>
        </div>
      </form>

      <table className="min-w-full bg-white border border-gray-200 mt-8">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Número de Documento</th>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Apellido</th>
            <th className="py-2 px-4 border-b">Teléfono</th>
            <th className="py-2 px-4 border-b">Dirección</th>
            <th className="py-2 px-4 border-b">Fecha de Nacimiento</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((persona) => (
            <tr key={persona.numeroDoc}>
              <td className="py-2 px-4 border-b">{persona.numeroDoc}</td>
              <td className="py-2 px-4 border-b">{persona.nombre}</td>
              <td className="py-2 px-4 border-b">{persona.apellido}</td>
              <td className="py-2 px-4 border-b">{persona.telefono}</td>
              <td className="py-2 px-4 border-b">{persona.direccion}</td>
              <td className="py-2 px-4 border-b">
                {new Date(persona.fechaDeNacimiento).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">{persona.mail}</td>
              <td className="py-2 px-4 border-b flex">
                <button
                  onClick={() => onEdit(persona)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(persona)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
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

export default PersonaForm;
