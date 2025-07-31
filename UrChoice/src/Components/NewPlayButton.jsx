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
      <div
        className="relative bg-contain bg-top bg-no-repeat w-full h-72 flex items-center justify-center"
        style={{
          backgroundImage: `url(${Logo})`,
          backgroundPosition: 'center top',
        }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center">
            UrChoice
          </h1>
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
