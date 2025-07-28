import { useState } from 'react'
import Logo from '../assets/logo.svg'
import { Home, Gamepad, Menu, X, Wrench } from 'lucide-react';

function LandingHeader() {
    const [menuToggle, setMenuToggle] = useState(false);
    const handleClick = () => {

        setMenuToggle(!menuToggle);
        
    };

    return (
        <header className="bg-gradient-to-b
        from-red-500 
        to-black
        flex items-center 
        ">
            <div className="image-logo w-20 min-w-[64px] sm:w-24 sm:min-w-[96px] m-2 flex">
                <picture>
                    <img srcSet={Logo} alt="Logo" className="w-full h-auto" />
                </picture>
            </div>
            <nav className='navbar w-full'>
                <ul className='flex justify-center space-x-12'>
                    <li>
                        <button className="flex items-center space-x-2">
                            <Home />
                            <span>Inicio</span>
                        </button>
                    </li>
                    <li>
                        <button className="flex items-center space-x-2">
                            <Gamepad />
                            <span>Categories</span>
                        </button>
                    </li>
                    <li>
                        <button className="flex items-center space-x-2">
                            <Wrench />
                            <span>Tools</span>
                        </button>
                    </li>
                </ul>
            </nav>
            <button className="flex items-center space-x-2 sm:hidden"
                onClick={handleClick}
            >
           {menuToggle ? <X /> : <Menu />}

            </button>


        </header>
    )
}

export default LandingHeader;