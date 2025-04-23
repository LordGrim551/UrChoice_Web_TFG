import "./home_category_card.css";
import React, { useEffect, useState } from 'react';
import { Heart, Bookmark } from 'lucide-react';

const HomeCategoryCard = () => {
    const [Categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`https://railwayserver-production-7692.up.railway.app/categories/all/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
            console.log('Datos recibidos:', data);

            if (response.ok && Array.isArray(data)) {
                const formattedCategories = data.map(category => ({
                    id_cat: category.id_cat,
                    name_cat: category.name_cat, // asegurarse que coincida con el render
                    img_cat: `data:image/png;base64,${category.img_cat}`,
                }));
                // const testCategories = Array(24).fill(formattedCategories[0]);
                setCategories(formattedCategories);
                // setCategories(testCategories);
                // setCategories(testCategories);

            }
        } catch (error) {
            console.error('Error al obtener las categorias:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        const interval = setInterval(fetchCategories, 10000); // opcional: refrescar cada 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full category-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4  p-4 overflow-y-auto scrollbar-custom max-h-[70vh]">
            {Categories.map((category) => (
                <div key={category.id_cat} className="category-card border  border-gray-300 rounded-lg shadow-md">
                    <div className="card-header bg-red-500 text-white rounded-t-lg p-2 text-center">
                        {category.name_cat}
                    </div>
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                        <img
                            src={category.img_cat}
                            alt={category.name_cat}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex items-center justify-evenly card-footer bg-cyan-500 text-white rounded-b-lg p-2 text-center">
                        ID: {category.id_cat}
                        <Heart size={24} />
                        <Bookmark size={24} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HomeCategoryCard;
