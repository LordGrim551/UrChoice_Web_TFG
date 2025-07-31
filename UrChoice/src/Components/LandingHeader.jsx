import { useState } from 'react';
import Logo from '../assets/logo.svg';
import { Home, Gamepad, Menu, X, Wrench } from 'lucide-react';
import '../Components/css/LandingHeader.css';
import { useNavigate } from 'react-router-dom';

function LandingHeader() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-gradient-to-b from-red-500 to-black flex items-center relative z-30 px-4 sm:px-8">
      {/* Logo */}
      <div
        className="image-logo w-20 min-w-[64px] sm:w-16 sm:min-w-[64px] m-2 flex-shrink-0 cursor-pointer active:scale-95 transition-transform duration-150"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Ir al inicio"
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleClick();
        }}
      >
        <picture>
          <img
            srcSet={Logo}
            alt="Logo"
            className="w-full h-auto select-none pointer-events-none"
            draggable={false}
          />
        </picture>
      </div>

      {/* Navegación desktop */}
      <nav className="hidden sm:flex flex-1 justify-center">
        <ul className="flex space-x-12">
          {[
            { icon: <Home />, label: 'Inicio', id: 'background' },
            { icon: <Gamepad />, label: 'Features', id: 'features' },
            { icon: <Wrench />, label: 'Tools', id: 'footer' },
          ].map(({ icon, label, id }) => (
            <li key={id}>
              <button
                className="flex items-center space-x-2 text-white hover:text-cyan-300 transition"
                onClick={() => scrollToSection(id)}
                aria-label={`Ir a ${label}`}
              >
                {icon}
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Botón menú móvil */}
      <button
        className="sm:hidden ml-auto text-white z-40 focus:outline-none focus:ring-2 focus:ring-cyan-300 rounded"
        onClick={() => setMobileMenu(!mobileMenu)}
        aria-expanded={mobileMenu}
        aria-label={mobileMenu ? 'Cerrar menú' : 'Abrir menú'}
      >
        {mobileMenu ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menú móvil */}
      {mobileMenu && (
        <div className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-md shadow-lg px-6 pt-4 pb-6 flex flex-col space-y-4 sm:hidden z-30">
          {[
            { icon: <Home />, label: 'Inicio', id: 'background' },
            { icon: <Gamepad />, label: 'Features', id: 'features' },
            { icon: <Wrench />, label: 'Tools', id: 'footer' },
          ].map(({ icon, label, id }) => (
            <button
              key={id}
              className="flex items-center space-x-2 text-white w-full justify-start text-lg hover:text-cyan-300 transition"
              onClick={() => {
                scrollToSection(id);
                setMobileMenu(false);
              }}
              aria-label={`Ir a ${label}`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

export default LandingHeader;
