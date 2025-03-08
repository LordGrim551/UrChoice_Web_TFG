import UrChoiceLogo from '../RegisterPage/LogoTodoSVG.svg';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import HomePage from '../HomePage/HomePage';
import { Link } from 'react-router-dom';

function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Animaciones de fondo */}
      <DotLottieReact className='absolute h-full w-screen' src="https://lottie.host/9ad2756e-5d0c-4e48-be43-d964c37daea0/lz10b4JsWT.lottie" loop autoplay />
      <DotLottieReact className='absolute h-full w-screen rotate-180' src="https://lottie.host/8f385097-1fd9-4e6b-8d84-ab7bb31d37db/nLLINWcew3.lottie" loop autoplay />
      
      {/* Logo */}
      <img src={UrChoiceLogo} className="logo UrChoice" alt="UrChoice logo" />
      
      {/* Formulario de registro */}
      <div className="w-full max-w-sm p-4 rounded-lg bg-black bg-opacity-60 backdrop-blur-md z-10">
        <h2 className="text-xl font-bold text-white text-center mb-4">Crear Cuenta</h2>
        
        <form className="space-y-3">
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-gray-300 mb-1">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white text-sm"
              placeholder="Tu nombre de usuario"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white text-sm"
              placeholder="nombre@ejemplo.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white text-sm"
              placeholder="••••••••"
            />
            <p className="mt-0.5 text-xs text-gray-400">Mínimo 6 caracteres</p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-300 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white text-sm"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-3 w-3 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
            />
            <label htmlFor="terms" className="ml-2 block text-xs text-gray-300">
              Acepto los <a href="#" className="text-cyan-500 hover:text-cyan-400">Términos y Condiciones</a>
            </label>
          </div>
          
          <div>
            <button
              type="button"
              className="w-full flex justify-center py-1.5 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-cyan-500 transition-all duration-300"
            >
              Crear Cuenta
            </button>
          </div>
        </form>
        
        <div className="flex items-center mt-4">
          <div className="flex-1 h-px bg-gray-700"></div>
          <p className="mx-2 text-xs text-gray-400">O</p>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1 rounded-md bg-white py-1.5 px-2 text-xs font-medium text-gray-800 shadow-sm hover:bg-gray-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.787-1.676-4.188-2.707-6.735-2.707-5.523 0-10 4.477-10 10s4.477 10 10 10c8.396 0 10.201-7.835 9.685-11.696l-9.685-0.001z" />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1 rounded-md bg-[#3b5998] py-1.5 px-2 text-xs font-medium text-white shadow-sm hover:bg-[#324d84]"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
            </svg>
            Facebook
          </button>
        </div>
        
        <p className="mt-4 text-center text-xs text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <a href="#" className="font-medium text-cyan-500 hover:text-cyan-400">
            Iniciar Sesión
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;