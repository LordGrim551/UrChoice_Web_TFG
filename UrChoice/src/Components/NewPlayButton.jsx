import Logo from '../assets/logoOpacity.svg';
import { Gamepad2 } from 'lucide-react';
import '../Components/css/NewPlayButton.css';
import { useNavigate } from 'react-router-dom';

function NewPlayButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/HomePage');
    } else {
      navigate('/Preloader');
    }
  };

  return (
    <section
      id="background-section"
      className="w-full bg-gradient-to-r from-red-500 via-black to-cyan-300 rounded-2xl flex flex-col items-center justify-center relative"
    >
      <div className="relative w-full max-w-5xl min-h-[175px] sm:min-h-[250px] md:min-h-[350px] flex flex-col items-center justify-center overflow-visible">

        {/* Imagen SVG responsiva */}
        <img
          src={Logo}
          alt="Logo background"
          className="absolute p-8 top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 
               w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] 
               opacity-30 pointer-events-none object-contain h-auto"
        />

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-12">
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center">
            UrChoice
          </span>
          <p className="mt-2 text-lg sm:text-xl md:text-2xl font-semibold text-cyan-200 drop-shadow text-center mb-5">
            Which will be your choice?
          </p>
          <button
            className="flex w-64 justify-center items-center bg-white text-black font-semibold rounded-md shadow-md hover:bg-gray-200 transition"
            type="button"
            onClick={handleClick}
            aria-label="Play now"
          >
            <Gamepad2 className="mr-3" />
            <span>Play now</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default NewPlayButton;
