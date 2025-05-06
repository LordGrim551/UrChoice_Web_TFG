import React, { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCard from "../AddCard/AddCard";

const EditCategory = ({ categoryData, onClose, onUpdate }) => {
    const [categoryName, setCategoryName] = useState('');
    const [cards, setCards] = useState([]);
    const [backgroundImage, setBackgroundImage] = useState('');
    const [originalImage, setOriginalImage] = useState('');
    const dialogModel = useRef(null);


    useEffect(() => {
        if (categoryData) {
            setCategoryName(categoryData.name_cat);
            setOriginalImage(categoryData.img_cat);
            fetchElements(categoryData.id_cat);
        }
    }, [categoryData]);

    const openDialog = () => {
        dialogModel.current?.showModal();
    };


    useEffect(() => {
        if (categoryData) {
            openDialog();
        }
    }, [categoryData]);

    const fetchElements = async (categoryId) => {
        try {
            const response = await fetch(`https://railwayserver-production-7692.up.railway.app/elements/${categoryId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Error al cargar elementos');
            }

            const data = await response.json();
            const formattedCards = data.map(element => ({
                id: element.id_elem,
                name: element.name_elem,
                image: element.img_elem.split(',')[1] || element.img_elem
            }));

            setCards(formattedCards);
        } catch (error) {
            console.error('Error al cargar elementos:', error);
            toast.error("Error al cargar los elementos de la categoría");
        }
    };

    const updateCategory = async () => {
        try {
            // Validaciones
            if (!categoryName || !cards.length || !(backgroundImage || originalImage)) {
                toast.error("Todos los campos son obligatorios");
                return;
            }

            // Validación específica para 2 cartas
            if (cards.length === 2) {
                toast.error("No se puede hacer update con solo 2 cartas");
                return;
            }

            if (cards.length < 4) {
                toast.error("Debes agregar al menos 4 cartas");
                return;
            }

            if (!isPowerOfTwo(cards.length)) {
                toast.error("El número de cartas debe ser una potencia de 2 (4, 8, 16, etc.)");
                return;
            }

            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id_user) {
                toast.error("Usuario no identificado");
                return;
            }

            // Enviar datos al servidor
            const response = await fetch(
                `https://railwayserver-production-7692.up.railway.app/categories/update`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_cat: categoryData.id_cat,
                        name_cat: categoryName,
                        img_cat: backgroundImage || originalImage.split(',')[1],
                        elements: cards.map((card) => ({
                            id_elem: card.id,
                            name_elem: card.name,
                            img_elem: card.image,
                        })),
                        id_user: user.id_user,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar categoría");
            }

            // Toast verde de éxito
            toast.success("¡Categoría actualizada con éxito!");
            setTimeout(() => {
                onUpdate();
                closeDialog();
            }, 5000);
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Error de conexión con el servidor");
        }
    };

    const isPowerOfTwo = (n) => {
        return n > 0 && (n & (n - 1)) === 0;
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result.toString();
            const base64String = result.split(',')[1] || result;
            setBackgroundImage(base64String);
        };
        reader.readAsDataURL(file);
    };

    const deleteCard = (cardId) => {
        setCards(cards.filter(card => card.id !== cardId));
    };

    const addCardToCategory = (newCard) => {
        setCards([...cards, {
            id: Date.now(),
            name: newCard.name,
            image: newCard.image.split(',')[1] || newCard.image
        }]);
    };

    const closeDialog = () => {
        dialogModel.current?.close();
        setCategoryName('');
        setBackgroundImage('');
        setCards([]);
        setOriginalImage('');
        onClose();
    };
  

    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <dialog
                ref={dialogModel}
                className="w-2xl dialog bg-black border-1 border-cyan-400 p-4 rounded shadow-lg text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto scrollbar-custom"
            >
                <h2 className="text-white text-lg mb-4">Editar Categoría</h2>

                <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-4">
                    <input
                        type="text"
                        name="categoryName"
                        placeholder="Nombre de la categoría"
                        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-4"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                    />

                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full text-white text-lg mb-4 p-4 border-4 border-cyan-400 rounded bg-gray-800 opacity-0 absolute z-10"
                        />
                        <div
                            className="w-full h-40 bg-gray-800 border-4 border-cyan-400 rounded mb-4 flex items-center justify-center"
                            style={{
                                backgroundImage: `url(${backgroundImage ? `data:image/jpeg;base64,${backgroundImage}` : originalImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {!backgroundImage && !originalImage && (
                                <span className="text-white">Seleccionar imagen</span>
                            )}
                        </div>
                    </div>

                    <AddCard onAddCard={addCardToCategory} />

                    <div className="border-cyan-400 border-4 rounded mt-4 p-4">
                        <h2 className="m-2 mb-4 text-start text-2xl">CARTAS</h2>
                        <div className="border-red-500 border-5 rounded p-4 flex gap-4 overflow-x-auto scrollbar-custom max-h-[70vh]">
                            {cards.length === 0 ? (
                                <p className="p-25 text-cyan-400 text-center text-lg">
                                    No has añadido ninguna carta todavía.
                                </p>
                            ) : (
                                cards.map((card) => (
                                    <div
                                        key={card.id}
                                        className="relative w-32 h-54 bg-transparent rounded-lg shadow-md overflow-hidden flex-shrink-0"
                                    >
                                        <button
                                            onClick={() => deleteCard(card.id)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center z-20"
                                        >
                                            X
                                        </button>
                                        <img
                                            src={`data:image/png;base64,${card.image}`}
                                            alt={card.name}
                                            className="w-full h-full object-cover"
                                        />
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
                            onClick={updateCategory}
                            className="w-full px-4 py-2 bg-cyan-400 text-white rounded hover:bg-cyan-500 transition-colors"
                        >
                            Actualizar Categoría
                        </button>
                        <button
                            type="button"
                            onClick={closeDialog}
                            className="w-full px-4 py-2 bg-transparent border border-cyan-400 rounded hover:bg-gray-800 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </form>
            </dialog>
        </div>
    );
};

export default EditCategory;