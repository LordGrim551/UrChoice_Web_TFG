import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UrChoiceLogo from '../TapToStart/LogoTodoSVG.svg';
import '../TapToStart/TapToStart.css'; // Asegúrate de importar Tailwind CSS
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function TapToStart() {
  const navigate = useNavigate(); // Inicializa el hook de navegación

  const handleClick = () => {
    const user = localStorage.getItem('user');
    if (user) {
      // Si el usuario está logueado, redirigir a la HomePage
      navigate('/HomePage');
    } else {
      // Si no está logueado, redirigir a la InitialPage
      navigate('/InitialPage');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mb-35">
      <DotLottieReact className='absolute h-full w-screen' src="https://lottie.host/9ad2756e-5d0c-4e48-be43-d964c37daea0/lz10b4JsWT.lottie" loop autoplay />
      <DotLottieReact className='absolute h-full w-screen rotate-180' src="https://lottie.host/8f385097-1fd9-4e6b-8d84-ab7bb31d37db/nLLINWcew3.lottie" loop autoplay />

      <img src={UrChoiceLogo} className="logo UrChoice" alt="React logo" />

      <div className="w-full space-y-2 relative">
        <div className="w-full h-3.5">
          <div
            className="absolute left-0 top-5 bg-cyan-300 h-11.5 transition-all duration-100 w-1/2 opacity-50"
          ></div>
          <div
            className="absolute right-0 top-5 bg-red-500 h-11.5 transition-all duration-100 w-1/2 opacity-50"
          ></div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-l font-bold z-10" style={{ top: '0%', transform: 'translateY(-0%)' }}>
          <button className='mt-5 bg-transparent' onClick={handleClick}>
            <span className="text-white">CLICK TO START</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TapToStart;
