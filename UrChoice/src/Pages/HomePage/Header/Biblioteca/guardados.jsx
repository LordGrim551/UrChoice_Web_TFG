javascript
import React from 'react';
import { FaBookmark } from 'react-icons/fa';

const Guardados = () => {
  const guardadosData = [
    { id: 1, nombre: 'Guardado 1', imagen: 'https://via.placeholder.com/150', },
    { id: 2, nombre: 'Guardado 2', imagen: 'https://via.placeholder.com/150' },
    { id: 3, nombre: 'Guardado 3', imagen: 'https://via.placeholder.com/150' },
    { id: 4, nombre: 'Guardado 4', imagen: 'https://via.placeholder.com/150' },
    { id: 5, nombre: 'Guardado 5', imagen: 'https://via.placeholder.com/150' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {guardadosData.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
          <img src={item.imagen} alt={item.nombre} className="w-full h-40 object-cover rounded-md mb-2" />
          <h3 className="text-lg font-medium">{item.nombre}</h3>
          <FaBookmark className="text-blue-500 mt-2" />
        </div>
      ))}
    </div>
  );
};

export default Guardados;
