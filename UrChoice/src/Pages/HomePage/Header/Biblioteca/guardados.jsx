import React, { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import Altera from "./altera_final.gif";

const Guardados = () => {
  const [guardados, setGuardados] = useState([]); // Cambié el nombre a minúscula para seguir convenciones

  const fetchSaved = async () => { // Eliminé el parámetro id_user
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id_user) {
        console.error('Usuario no encontrado en localStorage');
        return;
      }
      
      const response = await fetch(`https://railwayserver-production-7692.up.railway.app/saved/${user.id_user}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      console.log('Datos recibidos:', data);
      
      if (response.ok) {
        const formattedSaved = data.map(savedElement => ({
          id_saved: savedElement.id_saved,
          id_user: user.id_user,
          id_cat: savedElement.id_cat,
          name_cat: savedElement.name_cat,
          img_cat: `data:image/png;base64,${savedElement.img_cat}`
        })).filter(item => item.id_saved !== null); // Cambié id_fav por id_saved
        setGuardados(formattedSaved);
      }
    } catch (error) {
      console.error('Error al obtener las categorias:', error);
    }
  }

  useEffect(() => {
    fetchSaved();
    const interval = setInterval(fetchSaved, 10000); // Cambié a 10 segundos (10000ms)
    return () => clearInterval(interval);
  }, []);

  if (guardados.length === 0) { // Cambié Guardados por guardados
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <img
          src={Altera}
          alt="Altera"
          className="w-48 h-48 object-contain"
        />
        <p className="text-2xl font-bold mt-4">¡Ve a jugar y guarda categorias!</p>
      </div>
    );
  }

  return (
    <div className="w-full category-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 overflow-y-auto scrollbar-custom max-h-[70vh]">
      {guardados.map((item) => ( // Cambié Guardados por guardados
        <div
          key={item.id_saved} // Cambié id_fav por id_saved
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
              onClick={() => onCategoryClick(item.id_cat)} // Asegúrate de definir esta función
            />
          </div>
          <div className="flex items-center justify-evenly card-footer bg-cyan-500 text-white rounded-b-lg p-2 text-center">
            ID: {item.id_cat}
            <Bookmark size={24} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Guardados;