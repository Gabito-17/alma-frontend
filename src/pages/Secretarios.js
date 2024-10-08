import axios from "axios";
import React, { useEffect, useState } from "react";

const Secretarios = () => {
  const [formData, setFormData] = useState({
    idTipoDocumento: "",
    numeroDoc: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    sexo: "",
    fechaNacimiento: "",
    email: "",
  });
  const Sexo = {
    MASCULINO: "Masculino",
    FEMENINO: "Femenino",
    OTRO: "Otro",
    // Agrega otros valores según tu enum
  };

  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [secretarios, setsecretarios] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [erroresTexto, setErroresTexto] = useState({
    nombre: { vacio: false, contieneNumeros: false, contieneSimbolos: false },
    apellido: { vacio: false, contieneNumeros: false, contieneSimbolos: false },
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
      fechaNacimiento: "",
      email: "",
      idTipoDocumento: "",
      sexo: "",
    });
  };
  function mostrarAlerta(a) {
    alert(a);
  }

  //Calcular la edad de un secretario
  const calcularEdad = (fechaNacimiento) => {
    const cumpleaños = new Date(fechaNacimiento);
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
    if (telefono.length >= 1) {
      const longitudValida = telefono.length >= 7; //Minimo de 7 caracteres.
      const formatoValido = /^\d+$/.test(telefono); // Sin dígitos numéricos

      return longitudValida && formatoValido;
    } else {
      return true;
    }
  };

  //Validar email
  const validarEmail = (email) => {
    if (email.length >= 1) {
      // Expresión regular para validar el formato de email
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (regexEmail.test(email)) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const validarNroDoc = (numeroDoc) => {
    const vacio = numeroDoc.trim() === "";
    const contieneLetras = /[a-zA-Z]/.test(numeroDoc);
    const contieneSimbolos = /[!@#$%^&*(),.?":{}|<>+-]/.test(numeroDoc);

    return {
      vacio,
      contieneLetras,
      contieneSimbolos,
    };
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

  const onDelete = async (secretario) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/secretarios/${secretario.numeroDoc}`
      );
      console.log("secretario eliminado:", response.data);
      fetchSecretarios();
    } catch (error) {
      console.error(
        "Error al eliminar el secretario:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const onEdit = (secretario) => {
    if (!secretario.tipoDocumento) {
      console.error(
        "secretario no tiene todas las propiedades necesarias:",
        secretario
      );
      return;
    }

    setFormData({
      numeroDoc: secretario.numeroDoc,
      nombre: secretario.nombre,
      apellido: secretario.apellido,
      telefono: secretario.telefono,
      direccion: secretario.direccion,
      fechaNacimiento: secretario.fechaNacimiento,
      email: secretario.email,
      idTipoDocumento: String(secretario.tipoDocumento.idTipoDocumento),
      sexo: secretario.sexo,
    });
    setIsEditing(true);
  };

  useEffect(() => {
    fetchSecretarios();
    fetchTiposDocumento();
  }, []);

  const fetchSecretarios = async () => {
    try {
      const response = await axios.get("http://localhost:4000/secretarios");
      setsecretarios(response.data);
    } catch (error) {
      console.error("Error al obtener los secretarios:", error);
    }
  };

  const fetchTiposDocumento = async () => {
    try {
      const response = await axios.get("http://localhost:4000/tipo-documentos");
      setTiposDocumento(response.data);
    } catch (error) {
      console.error("Error al obtener los tipos de documento:", error);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (fechaNacimientoError === true) {
        alert("Error: Debe ser mayor de edad");
        return;
      }

      if (isEditing) {
        console.log(formData);
        await axios.patch(
          `http://localhost:4000/secretarios/${formData.numeroDoc}`,
          formData
        );
        mostrarAlerta("secretario Actualizado");
      } else {
        console.log(formData);
        await axios.post("http://localhost:4000/secretarios", formData);
        mostrarAlerta("Secretario Creado");
      }
      limpiarCampos();
      fetchSecretarios();
      setIsEditing(false); // Resetear el modo de edición
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "fechaNacimiento") {
      if (calcularEdad(value) < 18) {
        setFechaNacimientoError(true);
      } else {
        setFechaNacimientoError(false);
      }
    }
    if (name === "numeroDoc") {
      const errores = validarNroDoc(value);
      setErroresTexto((prevErrores) => ({
        ...prevErrores,
        [name]: errores,
      }));
    }
    if (name === "nombre" || name === "apellido") {
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

    if (name === "email") {
      const esValido = validarEmail(value);
      setErroresTexto((prevErrores) => ({
        ...prevErrores,
        mail: !esValido,
      }));
    }
  };

  return (
    <div className="container mx-auto mt-8 ">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md max-w-full mx-auto h-full"
      >
        <h2 className="text-2xl  font-bold mb-6 text-left">
          Registrar un secretario
        </h2>

        <div className="grid grid-cols-7 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700  mb-2 ">
              *Tipo de Documento:
            </label>
            <select
              name="idTipoDocumento"
              value={formData.idTipoDocumento}
              onChange={handleChange}
              onBlur={handleBlur}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={isEditing}
            >
              <option hidden>Seleccionar</option>
              {tiposDocumento.map((documento) => (
                <option
                  key={documento.idTipoDocumento}
                  value={String(documento.idTipoDocumento)}
                >
                  {documento.sigla}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700  mb-2">
              *Número de Documento:
            </label>
            {erroresTexto.numeroDoc.vacio && (
              <p className="text-red-500 text-sm mt-1">
                El número de documento no puede estar vacío.
              </p>
            )}
            {erroresTexto.numeroDoc.contieneLetras && (
              <p className="text-red-500 text-sm mt-1">
                El número de documento no puede contener letras.
              </p>
            )}
            {erroresTexto.numeroDoc.contieneSimbolos && (
              <p className="text-red-500 text-sm mt-1">
                El número de documento no puede contener símbolos.
              </p>
            )}
            <input
              disabled={isEditing}
              type="text"
              name="numeroDoc"
              value={formData.numeroDoc}
              onChange={handleChange}
              onBlur={handleBlur}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">*Sexo:</label>
            <select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              onBlur={handleBlur}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option hidden>Seleccionar</option>
              {Object.values(Sexo).map((sexo) => (
                <option key={sexo} value={sexo}>
                  {sexo}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 col-span-2">
            <label className="block text-gray-700  mb-2">*Nombre/s:</label>
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

          <div className="mb-4 col-span-2">
            <label className="block text-gray-700  mb-2">*Apellido/s:</label>
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
            <label className="block text-gray-700  mb-2">Teléfono:</label>
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

          <div className="mb-4 col-span-3">
            <label className="block text-gray-700  mb-2">Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              onBlur={handleBlur}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4 col-span-2">
            <label className="block text-gray-700  mb-2">Email:</label>
            {erroresTexto.mail && (
              <p className="text-red-500 text-sm mt-1">
                Por favor ingresa un correo electrónico válido.
              </p>
            )}
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700  mb-2">
              *Fecha de Nacimiento:
            </label>
            {fechaNacimientoError && (
              <p className="text-red-500 text-sm mt-1">
                Debe ser mayor de edad.
              </p>
            )}
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              onBlur={handleBlur}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        <div className="col-span-4 flex justify-end space-x-4">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  limpiarCampos();
                }}
                className="bg-red-300 hover:bg-red-500 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancelar Edición
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Guardar
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={limpiarCampos}
                className="bg-gray-500 hover:bg-gray-400 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Limpiar Campos
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Registrar secretario
              </button>
            </>
          )}
        </div>
      </form>

      <table className="bg-white p-8 rounded-lg shadow-md max-w-full mx-auto h-full mt-8">
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
          {secretarios.map((secretario) => (
            <tr key={secretario.numeroDoc}>
              <td className="py-2 px-4 border-b">{secretario.numeroDoc}</td>
              <td className="py-2 px-4 border-b">{secretario.nombre}</td>
              <td className="py-2 px-4 border-b">{secretario.apellido}</td>
              <td className="py-2 px-4 border-b">{secretario.telefono}</td>
              <td className="py-2 px-4 border-b">{secretario.direccion}</td>
              <td className="py-2 px-4 border-b">
                {secretario.fechaNacimiento}
              </td>
              <td className="py-2 px-4 border-b">{secretario.email}</td>
              <td className="py-2 px-4 border-b flex">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "¿Estás seguro de que deseas editar a este secretario?"
                      )
                    ) {
                      onEdit(secretario);
                    }
                  }}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white  py-1 px-2 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "¿Estás seguro de que deseas eliminar a este secretario?"
                      )
                    ) {
                      onDelete(secretario);
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
  );
};

export default Secretarios;
