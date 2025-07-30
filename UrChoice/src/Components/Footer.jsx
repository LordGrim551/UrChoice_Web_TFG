import Logo from '../assets/logo.svg';

function Footer() {
    return (
        <footer className="w-full rounded-2xl py-8 px-4" style={{
            background: 'linear-gradient(90deg, #e53935 0%, #000 50%, #36b6cc 100%)'
        }}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                {/* Logo y marca */}
                <div className="flex flex-col items-center md:items-start w-full md:w-auto mb-6 md:mb-0">
                    <img
                        src={Logo}
                        alt="UrChoice Logo"
                        className="w-24 h-auto sm:w-16 mb-2 transition-all"
                        style={{ maxWidth: '160px' }}
                    />
                    <span className="text-gray-400 text-sm font-semibold">@urchoice</span>
                </div>
                {/* Enlaces de navegación en 3 columnas */}
                <div className="flex flex-col sm:flex-row gap-8 w-full md:w-auto justify-center">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-white font-bold mb-2">Navegación</span>
                        <a href="#background" className="text-gray-400 text-sm hover:text-cyan-300">Inicio</a>
                        <a href="#testimonial" className="text-gray-400 text-sm hover:text-cyan-300">Descripción</a>
                        <a href="#categories" className="text-gray-400 text-sm hover:text-cyan-300">Categorías</a>
                    </div>
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-white font-bold mb-2">Características</span>
                        <a href="#features" className="text-gray-400 text-sm hover:text-cyan-300">Características</a>
                        <a href="#play" className="text-gray-400 text-sm hover:text-cyan-300">Jugar</a>
                        <a href="#footer" className="text-gray-400 text-sm hover:text-cyan-300">Contacto</a>
                    </div>
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-white font-bold mb-2">Redes</span>
                        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-cyan-300">Twitter</a>
                        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-cyan-300">Instagram</a>
                        <a href="mailto:info@urchoice.com" className="text-gray-400 text-sm hover:text-cyan-300">Email</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;