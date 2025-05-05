import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
const Favoritos = () => {

  const [favoritos, setFavoritos] = useState([]);
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
      if (response.ok) {
        const formattedFavoritos = data.map(favoritosElement => ({
          id_fav: favoritosElement.id_fav,
          id_user: id_user,
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

    fetchFavourites(id_user);
    const interval = setInterval(fetchFavourites, 10000); // opcional: refrescar cada 10s
    return () => clearInterval(interval);
  }, [id_user]);


  return (
    <div className='m-2'>
      {favoritos.length === 0 ? (
        <div className="text-center">No tienes categorias favoritas prueba la gran variedad de categorias o personaliza creando las tuyas propias</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoritos.map((item) => (
            <div key={item.id_fav} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
              <img src={item.img_cat} alt={item.name_cat} className="w-full h-40 object-cover rounded-md mb-2" />
              <h3 className="text-lg font-medium">{item.name_cat}</h3>
          <Heart className="text-blue-500 mt-2" />
            </div>))}
        </div>)}
    </div>
  );
};

export default Favoritos;
