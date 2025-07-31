import Logo from '../assets/logo.svg';

function Footer() {
    return (
        <footer
            id='footer'
            className="w-full rounded-2xl py-8 px-4 bg-gradient-to-r from-red-700 via-black to-cyan-600"
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                {/* Logo y marca */}
                <div className="flex flex-col items-center md:items-start w-full md:w-auto mb-6 md:mb-0">
                    <img
                        src={Logo}
                        alt="UrChoice Logo"
                        className="w-24 sm:w-20 md:w-24 h-auto mb-2 transition-all"
                    />
                    <span className="text-gray-400 text-sm font-semibold">@urchoice</span>
                </div>

                {/* Enlaces de navegación en 3 columnas */}
                <div className="flex flex-wrap justify-center gap-8 w-full md:w-auto">
                    {[
                        {
                            title: 'Navegación',
                            links: [
                                { href: '#background', label: 'Inicio' },
                                { href: '#testimonial', label: 'Descripción' },
                                { href: '#categories', label: 'Categorías' },
                            ],
                        },
                        {
                            title: 'Características',
                            links: [
                                { href: '#features', label: 'Características' },
                                { href: '#play', label: 'Jugar' },
                                { href: '#footer', label: 'Contacto' },
                            ],
                        },
                        {
                            title: 'Redes',
                            links: [
                                { href: 'https://twitter.com/', label: 'Twitter', external: true },
                                { href: 'https://instagram.com/', label: 'Instagram', external: true },
                                { href: 'mailto:info@urchoice.com', label: 'Email' },
                            ],
                        },
                    ].map((section, idx) => (
                        <nav key={idx} className="flex flex-col items-center md:items-start">
                            <span className="text-white font-bold mb-2">{section.title}</span>
                            {section.links.map(({ href, label, external }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target={external ? "_blank" : undefined}
                                    rel={external ? "noopener noreferrer" : undefined}
                                    className="text-gray-400 text-sm hover:text-cyan-300 transition-colors"
                                >
                                    {label}
                                </a>
                            ))}
                        </nav>
                    ))}
                </div>
            </div>
        </footer>
    );
}

export default Footer;
