import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import UrChoiceLogo from '../TapToStart/LogoTodoSVG.svg';
import '../InitialPage/InitialPage.css'; // Asegúrate de importar Tailwind CSS
import LogInPage from '../LoginPage/LoginPage';
import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import RegisterPage from '../RegisterPage/RegisterPage';
import HomePage from '../HomePage/HomePage';
function InitialPage() {
    return (
        <div className="flex flex-col items-center justify-center mb-10">
            <DotLottieReact className='absolute h-full w-screen z-negative' src="https://lottie.host/9ad2756e-5d0c-4e48-be43-d964c37daea0/lz10b4JsWT.lottie" loop autoplay />
            <DotLottieReact className='absolute h-full w-screen rotate-180 z-negative' src="https://lottie.host/8f385097-1fd9-4e6b-8d84-ab7bb31d37db/nLLINWcew3.lottie" loop autoplay />
            <img src={UrChoiceLogo} className="logo UrChoice" alt="React logo" />
            <div id="trapeziums-group">
                <div id="trapezium" className='text-l font-bold  text-center pt-5'>
                   
                    <Link to="/LogInPage" element={<LogInPage/>}>
                        <p className='text-l font-bold z-10 text-center pt-5'>LOG IN</p>
                    </Link>
                 
                </div>
             
                <div id="trapezium-rotate">
        
                    <Link to="/RegisterPage" element={<RegisterPage/>}>
                        <p className='rotate-180 text-l font-bold z-10 text-center pb-5'>REGISTER</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default InitialPage;