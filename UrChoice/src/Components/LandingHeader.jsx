import { useState } from 'react'
import Logo from '../assets/logo.svg'
import { Home, Gamepad, Menu, X, Wrench } from 'lucide-react';
import '../Components/css/LandingHeader.css';
import { useNavigate } from 'react-router-dom';

function LandingHeader() {
    const [mobileMenu, setMobileMenu] = useState(false);
    const navigate = useNavigate(); 
    const handleClick = () => {
        navigate('/'); 
    };

    // Función para scroll suave a un id
    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="bg-gradient-to-b from-red-500 to-black flex items-center  ">
            {/* Logo */}
            <div className="image-logo w-20 min-w-[64px] sm:w-16 sm:min-w-[64px] m-2 flex-shrink-0">
                <picture>
                    <img srcSet={Logo} alt="Logo" className="w-full h-auto" onClick={handleClick} />
                </picture>
            </div>

            {/* Nav desktop */}
            <nav className="navbar w-full hidden sm:flex">
                <ul className="flex justify-center space-x-12 w-full">
                    <li>
                        <button
                            className="flex items-center space-x-2"
                            onClick={() => scrollToSection('background')}
                        >
                            <Home />
                            <span>Inicio</span>
                        </button>
                    </li>
                    <li>
                        <button
                            className="flex items-center space-x-2"
                            onClick={() => scrollToSection('features')}
                        >
                            <Gamepad />
                            <span>Features</span>
                        </button>
                    </li>
                    <li>
                        <button
                            className="flex items-center space-x-2"
                            onClick={() => scrollToSection('footer')}
                        >
                            <Wrench />
                            <span>Tools</span>
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Botón menú móvil */}
            <button
                className="flex items-center space-x-2 sm:hidden ml-auto mr-4 text-white z-20"
                onClick={() => setMobileMenu(!mobileMenu)}
            >
                {mobileMenu ? <X /> : <Menu />}
            </button>

            {/* Mobile menu */}
            {mobileMenu && (
                <div className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-md shadow-lg px-4 pt-4 pb-6 flex flex-col space-y-4 sm:hidden z-15">
                    <button
                        className="flex items-center space-x-2 text-white w-full justify-start"
                        onClick={() => { scrollToSection('background'); setMobileMenu(false); }}
                    >
                        <Home />
                        <span>Inicio</span>
                    </button>
                    <button
                        className="flex items-center space-x-2 text-white w-full justify-start"
                        onClick={() => { scrollToSection('features'); setMobileMenu(false); }}
                    >
                        <Gamepad />
                        <span>Features</span>
                    </button>
                    <button
                        className="flex items-center space-x-2 text-white w-full justify-start"
                        onClick={() => { scrollToSection('footer'); setMobileMenu(false); }}
                    >
                        <Wrench />
                        <span>Tools</span>
                    </button>
                </div>
            )}
        </header>
    )
}

export default LandingHeader;