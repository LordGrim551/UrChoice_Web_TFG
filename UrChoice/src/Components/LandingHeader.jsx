import { useState } from 'react'
import Logo from '../assets/LogoTodoSVG.svg'

function LandingHeader() {

    return (
        <header className="bg-gradient-to-b from-red-500  to-black
        flex items-center
        ">
            <div className="image-logo w-24">
                <img src={Logo} alt="Logo"/>
            </div>
            <nav className='navbar'>
                <ul className='flex justify-between'>
                    <li>Home</li>
                    <li>Categories</li>
                    <li>Tools and Extras</li>
                </ul>
            </nav>
        </header>
    )
}

export default LandingHeader;