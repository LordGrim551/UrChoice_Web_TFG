import "./home_category_card.css";
import React, { useEffect, useState } from 'react';
import { Heart, Bookmark } from 'lucide-react';
import Altera from "./altera_final.gif";

const HomeCategoryCard = ({ onCategoryClick }) => {
    const [categories, setCategories] = useState([]);
    const [favorites, setFavorites] = useState({}); // Para rastrear qué categorías son favoritas
    const [saved, setSaved] = useState([]);
    const fetchCategories = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id_user) {
                console.error('Usuario no encontrado en localStorage');
                return;
            }
            const response = await fetch(`https://railwayserver-production-7692.up.railway.app/categories/${user.id_user}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
            console.log('Datos recibidos:', data);

            if (response.ok && Array.isArray(data)) {
                const formattedCategories = data.map(category => ({
                    id_cat: category.id_cat,
                    name_cat: category.name_cat,
                    img_cat: `data:image/png;base64,${category.img_cat}`,
                }));
                setCategories(formattedCategories);
                
                // Inicializar el estado de favoritos como false para todas las categorías
                const initialFavorites = {};
                formattedCategories.forEach(cat => {
                    initialFavorites[cat.id_cat] = false;
                });
                setFavorites(initialFavorites);
            }
        } catch (error) {
            console.error('Error al obtener las categorias:', error);
        }
    };

  
    const toggleFavorite = async (categoryId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id_user) {
                console.error('Usuario no encontrado en localStorage');
                return;
            }
            
            const isFavorite = favorites[categoryId];
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
                setFavorites(prev => ({
                    ...prev,
                    [categoryId]: !prev[categoryId]
                }));
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

    const toggleSaved = async (categoryId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id_user) {
                console.error('Usuario no encontrado en localStorage');
                return;
            }
            
            const isSaved = saved[categoryId];
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
                setSaved(prev => ({
                    ...prev,
                    [categoryId]: !prev[categoryId]
                }));
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
        fetchCategories();
        const interval = setInterval(fetchCategories, 10000);
        return () => clearInterval(interval);
    }, []);

    if (categories.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <img
                    src={Altera}
                    alt="Altera"
                    className="w-48 h-48 object-contain"
                />
                <p className="text-2xl font-bold mt-4">Has agregado todas las categorias disponible a tu biliblioteca</p>
            </div>
        );
    }

    return (
        <div className="w-full category-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 overflow-y-auto scrollbar-custom max-h-[70vh]">
            {categories.map((category) => (
                <div
                    key={category.id_cat}
                    className="category-card border border-gray-300 rounded-lg shadow-md cursor-pointer"
                >
                    <div className="card-header bg-red-500 text-white rounded-t-lg p-2 text-center">
                        {category.name_cat}
                    </div>
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                        <img
                            src={category.img_cat}
                            alt={category.name_cat}
                            className="w-full h-full object-cover"
                            onClick={() => onCategoryClick(category.id_cat)}
                        />
                    </div>
                    <div className="flex items-center justify-evenly card-footer bg-cyan-500 text-white rounded-b-lg p-2 text-center">
                        ID: {category.id_cat}
                        <Heart 
                            size={24} 
                            className="cursor-pointer" 
                            fill={favorites[category.id_cat] ? "red" : "none"} 
                            color={favorites[category.id_cat] ? "red" : "white"}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(category.id_cat);
                            }}
                        />
                        <Bookmark 
                            size={24} 
                            className="cursor-pointer" 
                            fill={saved[category.id_cat] ? "cyan" : "none"} 
                            color={saved[category.id_cat] ? "cyan" : "white"}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleSaved(category.id_cat);
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HomeCategoryCard;