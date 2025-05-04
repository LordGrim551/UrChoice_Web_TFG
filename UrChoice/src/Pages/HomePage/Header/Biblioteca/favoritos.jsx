javascript
import React from 'react';
import { AiFillHeart } from 'react-icons/ai';

const Favoritos = () => {
  const favoritosData = [
    { id: 1, name: 'Favorito 1', imageUrl: 'https://via.placeholder.com/150', isFavorite: true },
    { id: 2, name: 'Favorito 2', imageUrl: 'https://via.placeholder.com/150', isFavorite: true },
    { id: 3, name: 'Favorito 3', imageUrl: 'https://via.placeholder.com/150', isFavorite: true },
    { id: 4, name: 'Favorito 4', imageUrl: 'https://via.placeholder.com/150', isFavorite: true },
    { id: 5, name: 'Favorito 5', imageUrl: 'https://via.placeholder.com/150', isFavorite: true },
  ];

  return (
    <div className="favoritos-container">
      {favoritosData.map((item) => (
        <div key={item.id} className="favorito-item">
          <img src={item.imageUrl} alt={item.name} className="favorito-image" />
          <div className="favorito-details">
            <span className="favorito-name">{item.name}</span>
            {item.isFavorite && <AiFillHeart className="favorito-icon" />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Favoritos;
