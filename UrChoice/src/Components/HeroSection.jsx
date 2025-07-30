import Logo from '../assets/logoOpacity.svg'
import { Gamepad2 } from 'lucide-react';
import '../Components/css/HeroSection.css';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
    const navigate = useNavigate(); // Inicializa el hook de navegación

    const handleClick = () => {
        const user = localStorage.getItem('user');
        if (user) {
            // Si el usuario está logueado, redirigir a la HomePage
            navigate('/HomePage');
        } else {
            // Si no está logueado, redirigir a la InitialPage
            navigate('/Preloader');
        }
    };
    return (
        <div id='background' className='bg-gradient-to-t from-cyan-300 via-transparent to-black flex '>

            <div
                className="relative bg-contain bg-top bg-no-repeat w-full h-72  flex items-center justify-center"
                style={{
                    backgroundImage: `url(${Logo})`,
                    backgroundPosition: `center top(80%)`,

                }}
            >
                {/* Lottie fondo, capa inferior */}
                <DotLottieReact
                    className='absolute top-0 left-0 h-full w-full z-0'
                    src="https://lottie.host/9ad2756e-5d0c-4e48-be43-d964c37daea0/lz10b4JsWT.lottie"
                    loop
                    autoplay
                />
                <DotLottieReact
                    className='absolute top-0 left-0 h-full w-full z-0 rotate-180'
                    src="https://lottie.host/8f385097-1fd9-4e6b-8d84-ab7bb31d37db/nLLINWcew3.lottie"
                    loop
                    autoplay
                />

                {/* Contenido principal, capa superior */}
                <section className="relative z-10 w-full flex flex-col items-center">
                    <span className="text-2xl font-bold text-white drop-shadow-lg">UrChoice</span>
                    <p className='opacity-70 text-xl font-bold text-white drop-shadow-2xl'>Which will be your choice?</p>
                    <button className='flex w-64 justify-center items-center bg-white text-black' type="button"
                        onClick={handleClick}>
                        <Gamepad2 />
                        <span>Play now</span>
                    </button>
                </section>
            </div>
        </div>
    );
}

export default HeroSection;