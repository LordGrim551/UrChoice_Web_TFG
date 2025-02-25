import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import UrChoiceLogo from '../assets/LogoTodoSVG.svg';
import '../Pages/Preloader.css'; // Asegúrate de importar Tailwind CSS

function Loading() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/another-page'); // Redirige a otra página después de 3 segundos
          }, 3000); // Espera de 3 segundos
          return 100;
        }
        return prevProgress + 1;
      });
    }, 100);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={UrChoiceLogo} className="logo UrChoice mb-15" alt="React logo" />
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
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-xl font-bold z-10 " style={{ top: '-10%', transform: 'translateY(-50%)' }}>
          <p className='bg-black p-10 rounded-2xl mt-10'>{progress}%</p>
        </div>  
      </div>
    </div>
  );
}

function AnotherPage() {
  return <div>¡Llegaste al 100%! Bienvenido a la nueva página.</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loading />} />
        <Route path="/another-page" element={<AnotherPage />} />
      </Routes>
    </Router>
  );
}

export default App;