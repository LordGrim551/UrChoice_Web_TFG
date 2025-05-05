import React, { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import Altera from "./altera_final.gif";

const Guardados = ({ onCategoryClick }) => {
  const [guardados, setGuardados] = useState([]);
  const [isSavedMap, setIsSavedMap] = useState({});

  const fetchSaved = async () => {
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
        })).filter(item => item.id_saved !== null);
        
        setGuardados(formattedSaved);
        
        // Crear mapa de guardados para acceso rápido
        const savedMap = {};
        formattedSaved.forEach(item => {
          savedMap[item.id_cat] = true;
        });
        setIsSavedMap(savedMap);
      }
    } catch (error) {
      console.error('Error al obtener los guardados:', error);
    }
  }

  const toggleSaved = async (categoryId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id_user) {
        console.error('Usuario no encontrado en localStorage');
        return;
      }

      const isSaved = isSavedMap[categoryId];
      const endpoint = isSaved
        ? `https://railwayserver-production-7692.up.railway.app/saved/delete/${user.id_user}/${categoryId}`
        : 'https://railwayserver-production-7692.up.railway.app/saved/insert';

      const method = isSaved ? 'DELETE' : 'POST';

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
        // Actualizar el mapa de guardados
        setIsSavedMap(prev => ({
          ...prev,
          [categoryId]: !prev[categoryId]
        }));
        
        // Refrescar la lista de guardados
        if (isSaved) {
          setGuardados(prev => prev.filter(item => item.id_cat !== categoryId));
        } else {
          // Necesitarías obtener los datos de la categoría para agregarla
          fetchSaved();
        }
        
        console.log(isSaved
          ? "Eliminado de guardados correctamente"
          : "Agregado a guardados correctamente");
      } else {
        console.log("Error al modificar guardados");
      }
    } catch (error) {
      console.error('Error al modificar guardados:', error);
    }
  };

  useEffect(() => {
    fetchSaved();
    const interval = setInterval(fetchSaved, 10000);
    return () => clearInterval(interval);
  }, []);

  if (guardados.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <img
          src={Altera}
          alt="Altera"
          className="w-48 h-48 object-contain"
        />
        <p className="text-2xl font-bold mt-4">¡Ve a jugar y guarda categorías!</p>
      </div>
    );
  }

  return (
    <div className="w-full category-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 overflow-y-auto scrollbar-custom max-h-[70vh]">
      {guardados.map((item) => (
        <div
          key={item.id_saved}
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
              onClick={() => onCategoryClick && onCategoryClick(item.id_cat)}
            />
          </div>
          <div className="flex items-center justify-evenly card-footer bg-cyan-500 text-white rounded-b-lg p-2 text-center">
            ID: {item.id_cat}
            <Bookmark 
              size={24}
              className="cursor-pointer"
              fill={isSavedMap[item.id_cat] ? "cyan" : "none"}
              color={isSavedMap[item.id_cat] ? "cyan" : "white"}
              onClick={(e) => {
                e.stopPropagation();
                toggleSaved(item.id_cat);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Guardados;