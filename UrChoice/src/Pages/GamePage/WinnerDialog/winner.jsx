import React from "react";
import { useNavigate } from "react-router-dom";

const WinnerDialog = ({ isOpen, winnerImage, winnerName, onClose }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();  // Cierra el diálogo
    navigate("/HomePage");  // Redirige a la página de inicio
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      {/* Fondo más claro */}
      <div className="absolute inset-0 bg-transparent bg-opacity-30"></div>

      {/* Diálogo centrado con mayor altura */}
      <div
        className="relative bg-gray-900 border-8 border-cyan-400 rounded-xl p-8 max-w-md w-full mx-4 min-h-[500px] transform transition-all duration-500 shadow-2xl"
      >
        {/* Fondo de la imagen ocupando todo el diálogo */}
        <div
          className="absolute inset-0 bg-cover bg-center rounded-xl"
          style={{ backgroundImage: `url(${winnerImage})` }}
        ></div>

        {/* Contenido movido al fondo */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full pt-8">
          <h2 className="text-4xl font-bold text-white mb-4">{winnerName}</h2>
          <p className="text-gray-300 mb-6 font-bold">¡Ganador de esta ronda!</p>

          
        </div>
        <div className="relative z-10 mt-auto pt-64">
          <button
            onClick={handleClose}
            className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-bold text-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerDialog;
