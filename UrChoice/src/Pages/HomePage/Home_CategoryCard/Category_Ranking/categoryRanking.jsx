// Suggested code may be subject to a license. Learn more: ~LicenseLog:2187294219.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2360658734.
import React from 'react'; // Importa React
const Ranking = ({ categoryId, handleBack }) => {
  const rankings = [
    { id: 1, name: 'Category 1', score: 95, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Category 2', score: 90, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Category 3', score: 85, image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Category 4', score: 80, image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Category 5', score: 75, image: 'https://via.placeholder.com/150' },
  ];

  return (    
    <div className="border-2 border-cyan-400 p-4 rounded-lg w-full md:w-3/4 mx-auto">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 flex flex-col items-center md:items-start space-y-2">
          {rankings.map((item, index) => (
            <div key={item.id} className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              {index + 1}
            </div>
          ))}
        </div>
        <div className="md:w-1/2 space-y-4">
          {rankings.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p>Score: {item.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center my-4">Category ID: {categoryId}</div>
      <div className="flex flex-col md:flex-row justify-between mt-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleBack}>
          Back
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Empezar
        </button>
      </div>
    </div>
  );
};

export default Ranking;
