import React, { forwardRef, useImperativeHandle, useRef,useEffect, useState } from "react";
import { Heart, Bookmark } from 'lucide-react';

const ChooseCategory = forwardRef(({ onCategorySelect, onClose }, ref) => {
    const dialogModel = useRef(null);
    const [Categories, setCategories] = useState([]);

    // Exponer el método `showModal` al componente padre
    useImperativeHandle(ref, () => ({
        showModal: () => {
            dialogModel.current?.showModal();
        },
        closeModal: () => {
            dialogModel.current?.close();
        },
    }));
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
        <dialog
            ref={dialogModel}
            id="category-dialog"
            className="w-3xl dialog bg-black border-1 border-red-400 p-4 rounded shadow-lg text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
            <h2 className="text-white text-lg mb-4">Select a Category</h2>
            {/* Contenedor con scrollbar personalizado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto scrollbar-custom max-h-96">
                {Categories.map((category) => (
                    <div
                        key={category.name_cat}
                        className="cursor-pointer rounded-lg overflow-hidden border border-gray-600 hover:border-cyan-500"
                        onClick={() => onCategorySelect(category)}
                    >
                        <img src={category.img_cat} alt={category.name_cat} className="w-full h-32 object-cover" />
                        <p className="text-white text-center p-2 bg-gray-800">{category.name_cat}</p>
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={onClose}
                className="w-full mt-4 p-2 rounded bg-cyan-500 text-black hover:bg-cyan-600"
            >
                Close
            </button>
        </dialog>
    );
});

export default ChooseCategory;