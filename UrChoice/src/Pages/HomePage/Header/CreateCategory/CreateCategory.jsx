import React, { useRef, useState } from "react";
import AddCard from "../AddCard/AddCard";

const CreateCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [cards, setCards] = useState([]);
    const [backgroundImage, setBackgroundImage] = useState('');
    const dialogModel = useRef(null);

    const openDialog = () => {
        dialogModel.current?.showModal();
    };
    const user = JSON.parse(localStorage.getItem('user'));


    const createCategory = async () => {

        
        try {
            const response = await fetch(
                `https://railwayserver-production-7692.up.railway.app/categories/create`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name_cat: categoryName,
                        img_cat: backgroundImage,
                        elements: cards.map((card) => ({
                            name_elem: card.name,
                            img_elem: card.image,
                        })),
                        id_user: user.id_user,

                    }),
                }


            );
            console.table({
                "name category": categoryName,
                "background image": backgroundImage,
                "elements": cards

            });

            const category = await response.json();
            if (response.ok) {
                console.log("Category created successfully:", category);
                dialogModel.current?.close();
            } else {
                console.error("Error creating category:", category);
                console.warn("Error creating category:", category);
            }
        } catch (error) {
            console.warn("Fetch error:", error);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0]; // Obtiene el archivo seleccionado
        if (!file) return;
        // Validar tipo de archivo (solo imágenes)
        if (!file.type.startsWith('image/')) {
            alert("Por favor, sube un archivo de imagen válido (JPEG, PNG, etc.)");
            return;
        }

        // Validar tamaño (ej: máximo 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            alert("La imagen no debe superar los 2MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            // Convierte la imagen a Base64 (sin el prefijo "data:image/...")
            const base64String = reader.result.split(',')[1];
            setBackgroundImage(base64String); // Guarda el Base64 en el estado
        };
        reader.readAsDataURL(file); // Inicia la lectura del archivo
    };



    const deleteCard = (cardId) => {
        setCards(prevCards => prevCards.filter(card => card.id !== cardId));
    };

    const addCardToCategory = (newCard) => {
        setCards(prevCards => [...prevCards, {
            ...newCard,
            id: prevCards.length > 0 ? Math.max(...prevCards.map(c => c.id)) + 1 : 1
        }]);
    };
    const closeDialog = () => {
        dialogModel.current?.close();
        // Limpiar estados
        setCategoryName('');
        setBackgroundImage('');
        setCards([]);
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


                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createCategory(categoryName);
                    }}
                    className="space-y-4"
                >
                    <input
                        type="text"
                        name="categoryName"
                        placeholder="Category Name"
                        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-4"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />


                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full text-white text-lg mb-4 p-4 border-4 border-cyan-400 rounded bg-gray-800"
                        style={{
                            backgroundImage: backgroundImage
                                ? `url(data:image/jpeg;base64,${backgroundImage})`
                                : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    />


                    <AddCard onAddCard={addCardToCategory} />

                    <div className="border-cyan-400 border-4 rounded mt-4 p-4">
                        <h2 className="m-2 mb-4 text-start text-2xl">CARTAS</h2>
                        <div className="border-red-500 border-5 rounded p-4 flex gap-4 overflow-x-auto scrollbar-custom max-h-[70vh]">
                            {cards.length === 0 ? (
                                <p className="p-25 text-cyan-400 text-center text-lg">
                                    You haven't added any cards yet. What are you waiting for?
                                </p>
                            ) : (
                                cards.map((card) => (
                                    <div
                                        key={card.id}
                                        className="relative w-32 h-54 bg-transparent rounded-lg shadow-md overflow-hidden flex-shrink-0"
                                    >
                                        {/* Botón X */}
                                        <button
                                            onClick={() => deleteCard(card.id)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center z-20"
                                        >
                                            X
                                        </button>

                                         {/* Imagen que ocupa todo el espacio */}
                                       
                                        <img
                                            src={`data:image/png;base64,`+ card.image}
                                            alt={card.name}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Nombre superpuesto en la parte inferior */}
                                        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black bg-opacity-50 px-2 py-1">
                                            <p className="text-white text-xs font-bold text-center">{card.name}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:justify-between gap-2">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-cyan-400 text-white rounded hover:bg-gray-300"
                        >
                            Crear Categoria
                        </button>

                        <button
                            type="button"
                            onClick={() => closeDialog()}
                            className="w-full px-4 py-2 bg-transparent border border-cyan-400 rounded"
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