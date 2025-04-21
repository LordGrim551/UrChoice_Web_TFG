import React from "react";
import "./home_category_card.css";

const categories = [
    { id: 1, title: "Categoría 1", image: "https://via.placeholder.com/150" },
    { id: 2, title: "Categoría 2", image: "https://via.placeholder.com/150" },
    { id: 3, title: "Categoría 3", image: "https://via.placeholder.com/150" },
    { id: 4, title: "Categoría 4", image: "https://via.placeholder.com/150" },
    { id: 5, title: "Categoría 5", image: "https://via.placeholder.com/150" },
    { id: 6, title: "Categoría 6", image: "https://via.placeholder.com/150" },
    { id: 7, title: "Categoría 7", image: "https://via.placeholder.com/150" },
    { id: 8, title: "Categoría 8", image: "https://via.placeholder.com/150" },
    { id: 9, title: "Categoría 9", image: "https://via.placeholder.com/150" },
    { id: 10, title: "Categoría 10", image: "https://via.placeholder.com/150" },
    { id: 11, title: "Categoría 11", image: "https://via.placeholder.com/150" },
    { id: 12, title: "Categoría 12", image: "https://via.placeholder.com/150" },
    { id: 13, title: "Categoría 13", image: "https://via.placeholder.com/150" },
    { id: 14, title: "Categoría 14", image: "https://via.placeholder.com/150" },
    { id: 15, title: "Categoría 15", image: "https://via.placeholder.com/150" },
    { id: 16, title: "Categoría 16", image: "https://via.placeholder.com/150" },
    { id: 17, title: "Categoría 17", image: "https://via.placeholder.com/150" },
    { id: 18, title: "Categoría 18", image: "https://via.placeholder.com/150" },
    { id: 19, title: "Categoría 19", image: "https://via.placeholder.com/150" },
    { id: 20, title: "Categoría 20", image: "https://via.placeholder.com/150" },
    { id: 21, title: "Categoría 21", image: "https://via.placeholder.com/150" },
    { id: 22, title: "Categoría 22", image: "https://via.placeholder.com/150" },
    { id: 23, title: "Categoría 23", image: "https://via.placeholder.com/150" },
    { id: 24, title: "Categoría 24", image: "https://via.placeholder.com/150" },
];

const HomeCategoryCard = () => {
    return (
        <div className="w-full  category-container grid grid-cols-2 md:grid-cols-3 gap-4  max-h-screen p-4">
            {categories.map((category) => (
                <div key={category.id} className="category-card border border-gray-300 rounded-lg shadow-md ">
                    {/* Título con fondo rojo y bordes redondeados en las esquinas superiores */}
                    <div className="card-header bg-red-500 text-white rounded-t-lg p-2 text-center">
                        {category.title}
                    </div>
                    {/* Imagen */}
                    <img src={category.image} alt={category.title} className="card-image w-full h-auto" />
                    {/* ID con fondo cian y bordes redondeados en las esquinas inferiores */}
                    <div className="card-footer bg-cyan-500 text-white rounded-b-lg p-2 text-center">
                        ID: {category.id}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HomeCategoryCard;