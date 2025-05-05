import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import Altera from "./altera_final.gif";

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [isFavoriteMap, setIsFavoriteMap] = useState({});

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
        
        // Crear mapa de favoritos para acceso rápido
        const favoritesMap = {};
        formattedFavoritos.forEach(item => {
          favoritesMap[item.id_cat] = true;
        });
        setIsFavoriteMap(favoritesMap);
      }
    } catch (error) {
      console.error('Error al obtener las categorias:', error);
    }
  }

  const toggleFavorite = async (categoryId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id_user) {
        console.error('Usuario no encontrado en localStorage');
        return;
      }

      const isFavorite = isFavoriteMap[categoryId];
      const endpoint = isFavorite
        ? `https://railwayserver-production-7692.up.railway.app/fav/delete/${user.id_user}/${categoryId}`
        : 'https://railwayserver-production-7692.up.railway.app/fav/insert';

      const method = isFavorite ? 'DELETE' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...(method === 'POST' && {
          body: JSON.stringify({
            id_user: user.id_user,
            id_cat: categoryId,
          }),
        }),
      });

      if (response.ok) {
        // Actualizar el mapa de favoritos
        setIsFavoriteMap(prev => ({
          ...prev,
          [categoryId]: !prev[categoryId]
        }));
        
        // Refrescar la lista de favoritos
        if (isFavorite) {
          setFavoritos(prev => prev.filter(item => item.id_cat !== categoryId));
        } else {
          // Necesitarías obtener los datos de la categoría para agregarla
          fetchFavourites();
        }
        
        console.log(isFavorite
          ? "Eliminado de favoritos correctamente"
          : "Agregado a favoritos correctamente");
      } else {
        console.log("Error al modificar favoritos");
      }
    } catch (error) {
      console.error('Error al modificar favoritos:', error);
    }
  };

  useEffect(() => {
    fetchFavourites();
    const interval = setInterval(fetchFavourites, 10000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="w-full category-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 overflow-y-auto scrollbar-custom max-h-[70vh]">
      {favoritos.map((item) => (
        <div
          key={item.id_fav}
          className="category-card border border-gray-300 rounded-lg shadow-md cursor-pointer"
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
            <Heart 
              size={24}
              className="cursor-pointer"
              fill={isFavoriteMap[item.id_cat] ? "red" : "none"}
              color={isFavoriteMap[item.id_cat] ? "red" : "white"}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item.id_cat);
              }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Favoritos;