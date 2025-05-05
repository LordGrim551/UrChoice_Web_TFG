import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import Altera from "./altera_final.gif";

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]);

  const fetchFavourites = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id_user) {
        console.error('Usuario no encontrado en localStorage');
        return;
      }
      
      const response = await fetch(`https://railwayserver-production-7692.up.railway.app/favoritos/${user.id_user}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      console.log('Datos recibidos:', data);
      
      if (response.ok) {
        const formattedFavoritos = data.map(favoritosElement => ({
          id_fav: favoritosElement.id_fav,
          id_user: user.id_user,
          id_cat: favoritosElement.id_cat,
          name_cat: favoritosElement.name_cat,
          img_cat: `data:image/png;base64,${favoritosElement.img_cat}`
        })).filter(item => item.id_fav !== null);
        setFavoritos(formattedFavoritos);
      }
    } catch (error) {
      console.error('Error al obtener las categorias:', error);
    }
  }

  useEffect(() => {
    fetchFavourites();
    const interval = setInterval(fetchFavourites, 10000); // opcional: refrescar cada 10s
    return () => clearInterval(interval);
  }, []); // Eliminamos la dependencia id_user ya que lo obtenemos dentro de la función

  if (favoritos.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <img
          src={Altera}
          alt="Altera"
          className="w-48 h-48 object-contain"
        />
        <p className="text-2xl font-bold mt-4">¡Ve a jugar y dale amor!</p>
      </div>
    );
  }

  return (
    <div className="w-full category-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4  p-4 overflow-y-auto scrollbar-custom max-h-[70vh]">
      {favoritos.map((item) => (
        <div
          key={item.id_fav}
          className="category-card border  border-gray-300 rounded-lg shadow-md cursor-pointer"
        >
          <div className="card-header bg-red-500 text-white rounded-t-lg p-2 text-center">
            {item.name_cat}
          </div>
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <img
              src={item.img_cat}
              alt={item.name_cat}
              className="w-full h-full object-cover"
              onClick={() => onCategoryClick(item.id_cat)}
            />
          </div>
          <div className="flex items-center justify-evenly card-footer bg-cyan-500 text-white rounded-b-lg p-2 text-center">
            ID: {item.id_cat}
            <Heart size={24} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Favoritos;