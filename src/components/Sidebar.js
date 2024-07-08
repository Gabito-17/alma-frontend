import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [mostrarDesplegable, setMostrarDesplegable] = useState(false);

    const toggleDesplegable = () => {
        setMostrarDesplegable(!mostrarDesplegable);
    };

    const cerrarDesplegable = () => {
        setMostrarDesplegable(false);
    };

    return (
        <div className="bg-gray-800 text-white h-full w-64 fixed top-0 left-0 overflow-y-auto">
            <div className="p-4 font-bold text-xl">Consultorio</div>
            <nav className="p-4">
                <ul>
                    <li className="mb-2 p-2" style={{ userSelect: 'none' }}>
                        Sesiones
                    </li>
                    <li className="mb-2">
                        <Link to="/pacientes" className="hover:bg-gray-700 p-2 rounded block">Pacientes</Link>
                    </li>
                    <li className="mb-2 p-2" style={{ userSelect: 'none' }}>
                        Psicologos
                    </li>
                    <li className="mb-2 p-2" style={{ userSelect: 'none' }}>
                        Secretarios
                    </li>
                    <li className="mb-2 p-2" style={{ userSelect: 'none' }}>
                        Historias Clinicas
                    </li>
                    <li className="mb-2 p-2" style={{ userSelect: 'none' }}>
                        Derivaciones
                    </li>
                    <li
                        className="mb-2 relative p-2"
                        style={{ userSelect: 'none'}}
                        onMouseEnter={toggleDesplegable}
                        onMouseLeave={cerrarDesplegable}
                    > Parámetros
                        {mostrarDesplegable && (
                            <ul className="absolute bg-gray-700 text-white rounded shadow-md mt-1">
                                <li className="p-2">
                                    <Link to="/parametros/sexo" onClick={cerrarDesplegable}>Sexo</Link>
                                </li>
                                <li className="p-2">
                                    <Link to="/parametros/pais" onClick={cerrarDesplegable}>País</Link>
                                </li>
                                <li className="p-2">
                                    <Link to="/parametros/tipo-documento" onClick={cerrarDesplegable}>Tipo Documento</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
