import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import UrChoiceLogo from '../Preloader/LogoTodoSVG.svg';
import '../Preloader/Preloader.css'; // Asegúrate de importar Tailwind CSS
import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/Tap_to_start'); // Redirige a otra página después de 3 segundos
          }, 3000); // Espera de 3 segundos
          return 100;
        }
        return prevProgress + 1;
      });
    }, 100);
  }, [navigate]);

  return (
    

    <div className="flex flex-col items-center justify-center ">

      

      <DotLottieReact className='absolute h-full w-screen' src="https://lottie.host/9ad2756e-5d0c-4e48-be43-d964c37daea0/lz10b4JsWT.lottie" loop autoplay />
      <DotLottieReact className='absolute h-full w-screen rotate-180' src="https://lottie.host/8f385097-1fd9-4e6b-8d84-ab7bb31d37db/nLLINWcew3.lottie" loop autoplay />

      <img src={UrChoiceLogo} className="logo UrChoice " alt="React logo" />

      <div className="w-full space-y-2 relative">
        <div className="w-full h-3.5">
          <div
            className="absolute left-0 top-0 bg-cyan-300 h-9.5 transition-all duration-100"
            style={{ width: `${progress / 2}%` }}
          ></div>
          <div
            className="absolute right-0 top-0 bg-red-500 h-9.5 transition-all duration-100"
            style={{ width: `${progress / 2}%` }}
          ></div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-xl font-bold z-10 " style={{ top: '0%', transform: 'translateY(-0%)' }}>
          <p className='mt-15'>{progress}%</p>
        </div>



      </div>

    </div>

  );
}

export default Loading;

