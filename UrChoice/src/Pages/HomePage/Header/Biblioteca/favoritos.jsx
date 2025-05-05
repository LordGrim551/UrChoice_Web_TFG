import React from 'react';
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
const Favoritos = () => {

  const [Favoritos, setFavoritos] = useState([]);
  const [id_user, setIdUser] = useState('');



  useEffect(() => {
    const userId = localStorage.getItem('id_user');
    if (userId) setIdUser(userId);
  }, []);

  const fetchFavourites = async (id_user) => {
    try {
      const response = await fetch(`https://railwayserver-production-7692.up.railway.app/favoritos/${id_user}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }

      });
      const data = await response.json();
      console.log('Datos recibidos:', data);
      if (response.ok && Array.isArray(data)) {
        const formattedFavoritos = data.map(favoritosElement => ({
          id_fav: favoritosElement.id_fav,
          id_user: id_user,
          id_cat: favoritosElement.id_cat,
          name_cat: favoritosElement.name_cat,
          img_cat: `data:image/png;base64,${favoritosElement.img_cat}`
        }));
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
  }, []);


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

      {Favoritos.map((item) => (
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
