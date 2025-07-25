import React, { useEffect, useState } from 'react';
import { EditIcon, Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import EditCategory from '../../EditCategory/EditCategory'; // Asegúrate de que la ruta sea correcta
import DeleteCategory from './DeleteCategory/DeleteCategory';
const MisCategorias = ({ onCategoryClick }) => {
    const [mineCategories, setMineCategories] = useState([]);
    const [isMineMap, setIsMineMap] = useState({});
    const [editingCategory, setEditingCategory] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const fetchMineCategories = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id_user) {
                console.error('Usuario no encontrado en localStorage');
                return;
            }
            const response = await fetch(`https://railwayserver-production-7692.up.railway.app/categories/mine/${user.id_user}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
            if (response.ok && Array.isArray(data)) {
                const formattedMineCategories = data.map(mineCategories => ({
                    id_cat: mineCategories.id_cat,
                    name_cat: mineCategories.name_cat,
                    img_cat: `data:image/png;base64,${mineCategories.img_cat}`
                }));
                setMineCategories(formattedMineCategories);
                const mineCategoriesMap = {};
                formattedMineCategories.forEach(item => {
                    mineCategoriesMap[item.id_cat] = true;
                });
                setIsMineMap(mineCategoriesMap);
            }
        } catch (error) {
            console.error('Error al obtener mis categorias:', error);
        }
    }

    const handleEdit = (id_cat) => {
        const categoryToEdit = mineCategories.find(cat => cat.id_cat === id_cat);
        if (categoryToEdit) {
            setEditingCategory(categoryToEdit);
            setEditDialogOpen(true);
        }
    };

  
    const handleDelete = (id_cat) => {
        const category = mineCategories.find(cat => cat.id_cat === id_cat);
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(
                `https://railwayserver-production-7692.up.railway.app/categories/delete/${categoryToDelete.id_cat}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al eliminar categoría");
            }

            toast.success("¡Categoría eliminada con éxito!");
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
            fetchMineCategories();
        } catch (error) {
            toast.error("Error al eliminar categoría.");
            console.error(error);
        }
    };


    useEffect(() => {
        fetchMineCategories();
        const interval = setInterval(fetchMineCategories, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full category-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 overflow-y-auto scrollbar-custom max-h-[70vh]">
            {mineCategories.map((category) => (
                <div
                    key={category.id_cat}
                    className="category-card border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <div className="card-header bg-red-500 text-white rounded-t-lg p-2 text-center font-medium">
                        {category.name_cat}
                    </div>
                    <div className="relative w-full aspect-[4/3] overflow-hidden group">
                        <img
                            src={category.img_cat}
                            alt={category.name_cat}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Contenedor de iconos superpuestos */}
                        <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/50 to-transparent">
                            <div className="flex w-full px-4 space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(category.id_cat);
                                    }}
                                    className="flex-1 bg-white/90 text-cyan-600 p-2 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                                >
                                    <EditIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(category.id_cat);
                                    }}
                                    className="flex-1 bg-white/90 text-red-600 p-2 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                                >
                                    <Trash className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-cyan-500 text-white rounded-b-lg p-2 text-center text-sm">
                        ID: {category.id_cat}
                    </div>
                </div>
            ))}

            {editDialogOpen && (
                <EditCategory
                    categoryData={editingCategory}
                    onClose={() => setEditDialogOpen(false)}
                    onUpdate={fetchMineCategories} // Para refrescar la lista después de editar
                />
            )}
            {deleteDialogOpen && categoryToDelete && (
                <DeleteCategory
                    categoryData={categoryToDelete}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => {
                        setDeleteDialogOpen(false);
                        setCategoryToDelete(null);
                    }}
                />
            )}
        </div>
    );
};

export default MisCategorias;