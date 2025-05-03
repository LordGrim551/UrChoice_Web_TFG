import React, { useRef, useState } from "react";
import AddCard from "../AddCard/AddCard";

const CreateCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [cards, setCards] = useState([]);

    const [backgroundImage, setBackgroundImage] = useState(''); // Estado para la imagen de fondo
    const dialogModel = useRef(null);
    

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
                console.log("Category created successfully:", category);
                dialogModel.current?.close();
            } else {
                console.error("Error creating category:", category);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    // Función para manejar la carga de imágenes
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackgroundImage(reader.result); // Establecer la imagen cargada como fondo del input
            };
            reader.readAsDataURL(file);
        }
    };

    const deleteCard = (cardId) => {
        setCards(cards.filter(card => card.id !== cardId));
    };
    const addCardToCategory = (newCard) => {
        setCards([...cards, newCard]);
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
            <dialog
                ref={dialogModel}
                id="create-category-dialog"
                className="w-2xl dialog bg-black border-1 border-cyan-400 p-4 rounded shadow-lg text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
                <h2 className="text-white text-lg mb-4">Create Category</h2>
                <h2 className="text-white text-lg mb-4">Cards List</h2>

                {/* Formulario encapsulado */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createCategory(categoryName);
                    }}
                    className="space-y-4" // Espaciado entre los elementos del formulario
                >
                    <input
                        type="text"
                        name="categoryName"
                        placeholder="Category Name"
                        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-4"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />

                    {/* Input para cargar imagen con fondo */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}  // Cargar la imagen y establecer como fondo
                        className="w-full text-white text-lg mb-4 p-4 border-4 border-cyan-400 rounded bg-gray-800"
                        style={{
                            backgroundImage: `url(${backgroundImage})`,  // Fondo de la imagen
                            backgroundSize: 'cover',  // Asegura que la imagen ocupe todo el fondo
                            backgroundPosition: 'center',  // Ajuste de la imagen al centro
                            backgroundRepeat: 'no-repeat',  // Evita la repetición de la imagen
                        }}
                    />
                    <AddCard addCardToCategory={addCardToCategory} />

                        {/* Div para mostrar las cartas */}
                        <div className="border-cyan-400 border-4 rounded mt-4 p-4">
                            <h2 className="m-2 mb-4 text-start text-2xl">CARTAS</h2>
                            <div className="border-red-500 border-5 rounded border-2 p-4 flex gap-4 overflow-x-auto scrollbar-custom max-h-[70vh]">
                                {cards.map((card) => (
                                    <div
                                        key={card.id}
                                        className="relative w-32 h-48 bg-gray-800 rounded-lg shadow-md overflow-hidden flex-shrink-0"
                                    >
                                        <button onClick={() => deleteCard(card.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                        X
                                        </button>
                                        <img
                                            src={card.image}
                                            alt={card.name}
                                            className="w-full h-3/4 object-cover"
                                        />
                                        <div className="p-2">
                                            <p className="text-white text-sm">
                                                {card.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    {/* Botones de acción */}
                    <div className="flex flex-col md:flex-row md:justify-between gap-2">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-cyan-400 text-white rounded hover:bg-gray-300"
                        >
                            Create Category
                        </button>
                        <button
                            type="button"
                            onClick={() => dialogModel.current?.close()}
                            className="w-full px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </dialog>            
        </div>

    );
};

export default CreateCategory;
