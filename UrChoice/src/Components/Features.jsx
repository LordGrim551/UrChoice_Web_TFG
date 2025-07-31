import Add_create from '../assets/add_create.webp';
import Friends_game from '../assets/friends_game.webp';
import Game from '../assets/game.webp';

class Features_type {
    constructor(features_title, features_description, features_image) {
        this.features_title = features_title;
        this.features_description = features_description;
        this.features_image = features_image;
    }
}

function Features() {
    const features = [
        new Features_type(
            "Multiplayer",
            "Disfruta de una experiencia multijugador única donde puedes jugar con amigos o jugadores de todo el mundo votando por tus cartas favoritas en diversas categorías divertidas y creativas. El sistema del juego presenta una amplia variedad de temas únicos, que van desde los más cómicos hasta los más imaginativos, permitiéndote votar y competir en rondas online emocionantes. Cada partida es una oportunidad para descubrir cuáles cartas se destacan en la comunidad y ver cómo evolucionan las clasificaciones en tiempo real gracias al dinámico sistema de ranking del juego. ¿Podrá tu carta llegar a la cima? Participa en esta experiencia social y competitiva, crea alianzas o rivalidades con otros jugadores, y demuestra tu habilidad para elegir y defender tus cartas preferidas. Además, las votaciones en tiempo real garantizan que cada sesión sea diferente y emocionante, haciendo que la interacción con otros sea constante y atractiva.",
            Friends_game
        ),

        new Features_type(
            "Custom Decks",
            "Crea mazos personalizados y únicos eligiendo entre una amplia selección de cartas que varían en temática, apariencia y habilidades según el tipo de juego. Personaliza cada detalle de tu mazo, desde el nombre hasta los colores y los iconos, para que refleje tu estilo y estrategia personal. Puedes diseñar mazos competitivos para dominar las partidas o mazos temáticos divertidos que tus amigos puedan votar y disfrutar. La creatividad es el límite: combina cartas para crear sinergias poderosas o simplemente para divertirte con combinaciones originales. Además, el sistema permite guardar y modificar tus creaciones fácilmente, facilitando la experimentación y la evolución de tu estilo de juego. Así, cada jugador puede tener una experiencia única y totalmente adaptada a sus preferencias, fomentando la innovación y la personalización profunda. El juego también ofrece herramientas intuitivas para reorganizar cartas y previsualizar cómo funcionarán tus mazos en diferentes escenarios, asegurando que cada elección estratégica tenga impacto en la partida. Los diseñadores de mazos pueden compartir sus creaciones con la comunidad, permitiendo que otros jugadores descubran y voten por los mazos más originales y efectivos. Esta dinámica social y creativa enriquece la experiencia y mantiene el juego siempre fresco y desafiante.",
            Add_create
        ),

        new Features_type(
            "Card Collection",
            "Explora una vasta colección de cartas, incluyendo rarezas, temas especiales y ediciones limitadas que puedes descubrir mientras juegas y votas. Construye tu colección definitiva desbloqueando nuevas cartas a través de logros, eventos especiales y recompensas diarias. Si buscas alguna carta en particular, puedes intercambiar con amigos o con otros jugadores para completar tu conjunto ideal. Cada carta representa una oportunidad para expresar tu personalidad, tus gustos y tu estrategia dentro del juego. La colección no solo es un elemento estético, sino que también influye en la forma en que juegas y compites, permitiendo diversas combinaciones y tácticas. Además, las cartas limitadas o de eventos especiales hacen que la colección sea dinámica y siempre en expansión, incentivando a los jugadores a mantenerse activos y participativos para no perder ninguna novedad.",
            Game
        ),
    ];

    return (
        <section id='features' className="w-full py-8 px-4 sm:px-6 md:px-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Game Features</h2>
            <div className="flex flex-col items-center justify-center gap-6 w-full max-w-7xl mx-auto">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={`
                            w-full
                            flex
                            flex-col        /* Móvil y tablet: columna */
                            md:flex-col     /* Tablet sigue columna */
                            lg:flex-row     /* PC: fila */
                            items-center
                            rounded-xl
                            border-4
                            ${index % 2 === 0 ? 'border-cyan-300' : 'border-red-500'}
                            bg-black
                            min-h-[220px]
                            transition
                            ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}
                        `}
                    >
                        <img
                            src={feature.features_image}
                            alt={feature.features_title}
                            className={`
                                w-full
                                h-56
                                object-cover
                                rounded-lg
                                mb-4          /* margen debajo en móvil/tablet */
                                lg:mb-0       /* quitar margen en PC */
                                lg:w-[512px]  /* ancho fijo en PC */
                                lg:h-[324px]
                                object-top
                            `}
                        />
                        <div className="flex-1 text-center md:text-left px-4">
                            <h3 className="text-2xl font-bold text-white mb-2">{feature.features_title}</h3>
                            <p className="text-gray-300 mb-8">{feature.features_description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Features;
