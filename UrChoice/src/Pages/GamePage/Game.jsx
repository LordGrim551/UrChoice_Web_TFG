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
    ]; // Lista de imágenes

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
            <div className="gallery">
                {visibleImages.map((image, index) => (
                    <div
                        className={`item ${expandedIndex === currentIndex + index ? "expanded" : ""}`}
                        key={index}
                        onClick={() => handleClick(currentIndex + index)}
                    >
                        <img
                            src={image}
                            alt={imageNames[currentIndex + index]}
                            className={expandedIndex === currentIndex + index ? "expanded-img" : ""}
                        />
                        <span className="label">{imageNames[currentIndex + index]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GamePage;
