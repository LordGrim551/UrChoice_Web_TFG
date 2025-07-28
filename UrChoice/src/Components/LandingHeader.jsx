import { useState } from 'react'
import Logo from '../assets/logo.svg'
import { Home, Gamepad, Wrench } from 'lucide-react';

function LandingHeader() {

    return (
        <header className="bg-gradient-to-b
        from-red-500 
        to-black
        flex items-center 
        ">
            <div className="image-logo w-24 m-2">
                <picture>
                    <img srcSet={Logo} alt="Logo" />
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

        </header>
    )
}

export default LandingHeader;