import { useLocation, useNavigate } from "react-router-dom";
import miGif from '../Error/altera_final.gif';

const ErrorPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const errorCode = location.state?.errorCode || 404; // Si no hay estado, por defecto 404

    let message;
    switch (errorCode) {
        case 404:
            message = 'Página no encontrada';
            break;
        case 500:
            message = 'Error en el servidor';
            break;
        case 403:
            message = 'Acceso denegado';
            break;
        case 401:
            message = 'Error al iniciar sesión';
            break;
        default:
            message = 'Ocurrió un error inesperado';
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center px-6">
            <h1 className="text-6xl font-extrabold text-cyan-300 mb-4">Error {errorCode}</h1>
            <p className="text-xl font-semibold text-red-500 mb-6">{message}</p>
            
            <img src={miGif} alt="Animación de error" className="w-64 h-auto mb-6" />
            
            <button 
                onClick={() => navigate('/')} 
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
            >
                Volver al inicio
            </button>
        </div>
    );
};

export default ErrorPage;
