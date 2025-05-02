import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const NextRound = ({ onComplete, roundNumber }) => {
  const [counter, setCounter] = useState(3);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);




 
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (counter <= 0) {
      setIsClosing(true);
      setTimeout(() => {
        onComplete();
      }, 500);
      return;
    }

    const timer = setTimeout(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [counter, onComplete]);

  const handleSkip = () => {
    setIsClosing(true);
    setTimeout(onComplete, 500);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${isClosing ? "opacity-0" : "opacity-100"}`}>
      {/* Fondo más claro para ver mejor las imágenes */}
      <div className="absolute inset-0 bg-transparent bg-opacity-30"></div>
      
      {/* Diálogo centrado */}
      <div 
        className={`relative bg-gray-900 border-2 border-cyan-400 rounded-xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 ${
          isVisible ? "scale-100" : "scale-75"
        } ${isClosing ? "scale-90 opacity-0" : ""} shadow-2xl`}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">
            Ronda {roundNumber} completada!
          </h2>
          <p className="text-gray-300 mb-6">Preparando la siguiente batalla...</p>
          
          <div className="my-8 flex flex-col items-center">
            <span className="text-gray-400 text-sm mb-2">Siguiente ronda en:</span>
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 rounded-full opacity-20 animate-ping"></div>
              <div className="relative text-6xl font-bold text-cyan-400 bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center border-2 border-cyan-400">
                {counter}
              </div>
            </div>
          </div>

          {/* <button
            onClick={handleSkip}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
          >
            Saltar
          </button> */}
        </div>
      </div>
    </div>
  );
};

NextRound.propTypes = {
  onComplete: PropTypes.func.isRequired,
  roundNumber: PropTypes.number.isRequired
};

export default NextRound;