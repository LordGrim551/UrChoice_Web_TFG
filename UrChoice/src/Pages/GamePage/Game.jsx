import React, { useState } from "react";
import "./Game.css";

const GamePage = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0); // Índice para controlar las imágenes visibles

    const images = [
        "https://assets.codepen.io/1480814/archer.jpg", // Primera imagen
        "https://assets.codepen.io/1480814/saber.jpg",  // Segunda imagen
        "https://media.kg-portal.ru/anime/f/fatestaynight2014/images/fatestaynight2014_146.jpg", // Tercera imagen
        "https://i.pinimg.com/736x/18/70/93/187093f28d04b4df70dba5734a3ab308.jpg"  // Cuarta imagen
    ]; // Lista de imágenes actualizada

    const imageNames = ["Archer", "Saber", "Lancer", "Rider"]; // Nombres de las imágenes


    const visibleImages = images.slice(currentIndex, currentIndex + 2); // Mostrar solo 2 imágenes a la vez

    const handleClick = (index) => {
        setExpandedIndex(index); // Expandir la imagen seleccionada

        // Después de 3 segundos, volver al estado original y mostrar las siguientes imágenes
        setTimeout(() => {
            setExpandedIndex(null); // Restaurar el estado original
            setCurrentIndex((prevIndex) => (prevIndex + 2) % images.length); // Mostrar las siguientes 2 imágenes
        }, 3000);
    };

    return (
        <div className="game-page">
            <div className={`gallery ${expandedIndex !== null ? "expanding" : ""}`}>
                {visibleImages.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Character ${index}`}
                        onClick={() => handleClick(index)}
                        className={`${expandedIndex === index ? "expanded" : ""} ${expandedIndex !== null && expandedIndex !== index ? "grayscale" : ""}`} // Aplicar grayscale a las no seleccionadas
                    />




                ))}
                <div className="image-names">
                    {visibleImages.map((_, index) => (
                        <span key={index} className={`image-name ${expandedIndex === index ? "visible" : ""}`}>
                            {imageNames[currentIndex + index]}
                        </span>
                    ))}

                </div>
            </div>

        </div>
    );
};

export default GamePage;
