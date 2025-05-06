import React from "react";

const DeleteCategory = ({ categoryData, onConfirm, onCancel }) => {
    return (
        <dialog open className="w-96 bg-black border border-cyan-400 p-6 rounded shadow-lg text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-lg font-semibold mb-4">¿Eliminar Categoría?</h3>
            <p className="mb-6">¿Estás seguro que deseas eliminar la categoría <strong>{categoryData.name_cat}</strong>?</p>
            <div className="flex flex-col md:flex-row md:justify-between gap-3">
                <button
                    onClick={onConfirm}
                    className="w-full px-4 py-2 bg-cyan-400 text-white rounded hover:bg-cyan-500 transition-colors"
                >
                    Sí
                </button>
                <button
                    onClick={onCancel}
                    className="w-full px-4 py-2 bg-transparent border border-cyan-400 rounded hover:bg-gray-800 transition-colors"
                >
                    No
                </button>
            </div>
        </dialog>
    );
};

export default DeleteCategory;
