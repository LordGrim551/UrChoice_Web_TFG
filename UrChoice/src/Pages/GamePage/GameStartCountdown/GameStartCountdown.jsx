import React, { useState, useEffect } from "react";

const GameStartCountdown = ({ onComplete }) => {
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

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${isClosing ? "opacity-0" : "opacity-100"}`}>
      <div className="absolute inset-0 bg-transparent bg-opacity-60"></div>

      <div className={`relative bg-gray-900 border-2 border-cyan-400 rounded-xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 ${
        isVisible ? "scale-100" : "scale-75"
      } ${isClosing ? "scale-90 opacity-0" : ""} shadow-2xl`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">
            ¡Comenzamos!
          </h2>
          <p className="text-gray-300 mb-6">Preparando la primera batalla...</p>

          <div className="my-8 flex flex-col items-center">
            <span className="text-gray-400 text-sm mb-2">Empieza en:</span>
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 rounded-full opacity-20 animate-ping"></div>
              <div className="relative text-6xl font-bold text-cyan-400 bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center border-2 border-cyan-400">
                {counter}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStartCountdown;
