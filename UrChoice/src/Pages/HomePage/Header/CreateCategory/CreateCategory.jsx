import React, { useRef, useState } from "react";

const CreateCategory = () => {
    const dialogModel = useRef(null);
    const [categoryName, setCategoryName] = useState("");

    const openDialog = () => {
        dialogModel.current?.showModal();
    };

    const createCategory = async (name) => {
        try {
            const response = await fetch(
                `https://railwayserver-production-7692.up.railway.app/category/create`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name_cat: name,
                    }),
                }
            );

            const category = await response.json();
            if (response.ok) {
                console.log("category created successfully:", category);
                dialogModel.current?.close();
            } else {
                console.error("Error creating category:", category);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    return (
        <div>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    openDialog();
                }}
                className="text-red-500 border border-red-600 hover:bg-red-500 hover:text-white text-xs md:width-full block px-3 py-2 rounded-md transition cursor-pointer"
            >
                CREAR CATEGORIA
            </a>
            <dialog ref={dialogModel} id="create-category-dialog" className="w-2xl dialog bg-black border-1 border-cyan-400 p-4 rounded shadow-lg text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <h2 className="text-white text-lg mb-4">Create Category</h2>
                <input type="text" name="categoryName" placeholder="Category Name" className="p-2 rounded bg-gray-800 text-white border border-gray-600 mb-4" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                <div className="flex flex-col md:flex-row md:justify-between gap-2">
                    <button type="button" onClick={() => createCategory(categoryName)} className="w-1/2 px-4 py-2 bg-cyan-400 text-white rounded hover:bg-gray-300">
                        Create Category
                    </button>
                    <button type="button" onClick={() => dialogModel.current?.close()} className="w-1/2 px-4 py-2 bg-red-500 text-white rounded">
                        Close
                    </button>
                </div>
            </dialog>
        </div>
    );
};

export default CreateCategory;