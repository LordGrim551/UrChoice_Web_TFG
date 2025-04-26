import React, { useState } from "react";
import "./Game.css";

const GamePage = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
        "https://assets.codepen.io/1480814/archer.jpg",
        "https://assets.codepen.io/1480814/saber.jpg",
        "https://media.kg-portal.ru/anime/f/fatestaynight2014/images/fatestaynight2014_146.jpg",
        "https://i.pinimg.com/736x/18/70/93/187093f28d04b4df70dba5734a3ab308.jpg"
    ];

    const imageNames = ["Archer", "Saber", "Lancer", "Rider"];
    const visibleImages = images.slice(currentIndex, currentIndex + 2);

    const handleClick = (index) => {
        setExpandedIndex(index);
        setTimeout(() => {
            setExpandedIndex(null);
            setCurrentIndex((prevIndex) => (prevIndex + 2) % images.length);
        }, 3000);
    };

    return (
        <div className="game-page">
            <div className={`gallery ${expandedIndex !== null ? "expanding" : ""}`}>
                {visibleImages.map((image, index) => {
                    const globalIndex = currentIndex + index;
                    return (
                        <div
                            className="item"
                            key={index}
                            onClick={() => handleClick(globalIndex)}
                        >
                            <img
                                src={image}
                                alt={imageNames[globalIndex]}
                                className={`gallery-img 
                                    ${expandedIndex === globalIndex ? "expanded" : ""}
                                    ${expandedIndex !== null && expandedIndex !== globalIndex ? "grayscale" : ""}
                                `}
                            />
                            <span className="label">{imageNames[globalIndex]}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GamePage;
