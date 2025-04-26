import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Altera from "./altera_final.gif"; // Asegúrate de que la ruta sea correcta

const WaitingDialog = ({ isOpen, gifPath }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsClosing(true);
      setTimeout(() => setIsVisible(false), 500); // Animación de cierre
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${isClosing ? "opacity-0" : ""}`}
    >
      {/* Fondo más claro */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Diálogo centrado */}
      <div
        className={`relative bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 transform transition-all duration-500 ${
          isVisible ? "scale-100" : "scale-75"
        } ${isClosing ? "scale-75 opacity-0" : ""} shadow-lg`}
      >
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">Esperando...</h2>
          <div className="mt-4 flex justify-center">
            {/* Imagen GIF local */}
            <img src={Altera} alt="Cargando..." className="w-32 h-32 object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};

WaitingDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  gifPath: PropTypes.string.isRequired,
};

export default WaitingDialog;
