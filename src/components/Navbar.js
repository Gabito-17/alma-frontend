import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 text-white w-full h-16 fixed top-0 z-50 flex justify-between items-center px-4">
            <h1 className="text-xl font-bold">Consultorio</h1>
            <div className="flex items-center">
                
                <p className="text-sm font-semibold mr-8">Lombardo Cristian</p>

                <img
                    className="h-8 w-8 rounded-full object-cover"
                    src="ruta/a/la/foto.jpg"
                    alt=""
                />
                
            </div>
        </nav>
    );
};

export default Navbar;
