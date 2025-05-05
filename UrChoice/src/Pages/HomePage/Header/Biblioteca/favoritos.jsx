import React from 'react';

import { Heart } from 'lucide-react';
const Favoritos = () => {
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      
      {favoritosData.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
        <img src={item.imagen} alt={item.nombre} className="w-full h-40 object-cover rounded-md mb-2" />
        <h3 className="text-lg font-medium">{item.nombre}</h3>
        <Heart className="text-blue-500 mt-2" />
      </div>
      ))}
    </div>
  );
};

export default Favoritos;
