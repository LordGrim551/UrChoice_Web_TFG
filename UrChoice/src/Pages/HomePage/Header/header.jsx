import { useState } from "react";
import './header.css';
import Logo from './logo.png';
import ProfileHeader from "../ProfileHeader/profile";
import CreateRoom from "./CreateRoomDialog/CreateRoom";
import CrearCategory from "./CreateCategory/CreateCategory"
import CreateCategory from "./CreateCategory/CreateCategory";
import { useNavigate } from 'react-router-dom';
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  setTimeout(() => {
    setIsLoading(false);
  }, 2000);
  const handleInicio = (e) => {
    e.preventDefault();
    navigate('/HomePage');
  };
  const handlePerfil = (e) => {
    e.preventDefault();
    navigate('User')
  }
  const handleBiblioteca = (e) => {
    e.preventDefault();
    navigate('Biblioteca'); // Navegación relativa al path actual
  };

  return (
    <header className="bg-black border-5 border-red-600 backdrop-blur-md sticky top-0 z-50 rounded-2xl">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Contenedor del logo y el nav */}
          <div className="flex items-center gap-x-8">
            {/* Logo */}
            <div className="flex items-center gap-3 text-xl font-bold text-red-600">
              {isLoading ? (
                <div className="h-10 w-32 bg-gray-900 animate-pulse rounded-md"></div>
              ) : (
                <>
                  <picture>
                    <source srcSet={Logo} type="image/svg+xml" />
                    <img src={Logo} alt="Logo" className="h-10 w-auto" />
                  </picture>
                  <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-cyan-400">
                    UrChoice
                  </h1>
                </>
              )}
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex space-x-4 items-center">
              {isLoading ? (
                <div className="flex space-x-4">
                  {Array(4)
                    .fill()
                    .map((_, index) => (
                      <div
                        key={index}
                        className="h-8 w-24 bg-gray-900 animate-pulse rounded-md"
                      ></div>
                    ))}
                </div>
              ) : (
                <>
                  <a
                    href="/HomePage"
                    onClick={handleInicio}
                    className="text-red-500 border border-red-600 hover:bg-red-500 hover:text-white text-xs md:width-full block px-3 py-2 rounded-md transition cursor-pointer"
                  >
                    INICIO
                  </a>
                
                  <CreateCategory />
                  <CreateRoom />


                  <a
                    href="/Biblioteca"
                    onClick={handleBiblioteca}
                    className="text-red-500 border border-red-600 hover:bg-red-500 hover:text-white text-xs md:width-full block px-3 py-2 rounded-md transition cursor-pointer"
                  >
                    BIBLIOTECA
                  </a>
                  <a
                    href="/Perfil"
                    onClick={handlePerfil}
                    className="text-red-500 border border-red-600 hover:bg-red-500 hover:text-white text-xs md:width-full block px-3 py-2 rounded-md transition cursor-pointer"
                  >
                    PERFIL
                  </a>


                </>
              )}
            </nav>
          </div>

          {/* Profile */}
          <div className="hidden md:flex">
            <ProfileHeader />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-red-600 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-transparent/80 backdrop-blur-md shadow-lg px-4 pt-4 pb-6 space-y-3">
          {isLoading ? (
            <>
              <div className="h-8 w-24 bg-gray-900 animate-pulse rounded-md"></div>
              <div className="h-8 w-24 bg-gray-900 animate-pulse rounded-md"></div>
              <div className="h-8 w-24 bg-gray-900 animate-pulse rounded-md"></div>
            </>
          ) : (
            <>
              <ProfileHeader />
              <a
                href="/HomePage"
                onClick={handleInicio}
                className="text-red-500 border border-red-600 hover:bg-red-500 hover:text-white text-xs md:width-full block px-3 py-2 rounded-md transition cursor-pointer"
              >
                INICIO
              </a>
              <CreateCategory />
              <CreateRoom />


              <a
                href="/Biblioteca"
                onClick={handleBiblioteca}
                className="text-red-500 border border-red-600 hover:bg-red-500 hover:text-white text-xs md:width-full block px-3 py-2 rounded-md transition cursor-pointer"
              >
                BIBLIOTECA
              </a>
              <a
                href="/Perfil"
                onClick={handlePerfil}
                className="text-red-500 border border-red-600 hover:bg-red-500 hover:text-white text-xs md:width-full block px-3 py-2 rounded-md transition cursor-pointer"
              >
                PERFIL
              </a>
            </>
          )}
        </div>
      )}
    </header>
  );
}
