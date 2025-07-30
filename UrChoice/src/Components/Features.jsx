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
            "Play with friends online by voting for your favorite cards across different fun and creative categories. The game system offers a variety of unique themes—from the funniest to the most imaginative—where you and other players can vote for the cards you like the most. Join online voting rounds with friends or random players, discover the most popular cards, and watch the results unfold in real-time through the game's dynamic ranking system. Will your card make it to the top? Find out as you compete, vote, and climb the ranks in this fun and social experience!",
            Friends_game
        ),
        new Features_type(
            "Custom Decks",
            "Design unique card collections by choosing from a wide variety of cards, each with different themes, visuals, or abilities (depending on the game type). Personalize your decks with names, colors, icons, and more to make them truly your own. Whether you're building the ultimate competitive lineup or a fun, themed deck for friends to vote on, the creative possibilities are endless.",
            Add_create
        ),
        new Features_type(
            "Card Collection",
            "Discover rare, themed, or limited-edition cards as you play and vote. Build your ultimate collection by unlocking new cards through achievements, events, or rewards. Want something specific? Trade with friends or other players to get the cards you love most. Every card is a chance to express your personality and strategy—will you collect them all?",
            Game
        ),
    ];
    return (
        <section className="w-full py-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Game Features</h2>
            <div className="flex flex-col md:flex items-center justify-center gap-6 w-full">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={`
                            w-full md:flex flex-col md:flex-row
                            ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}
                            items-center
                            rounded-xl
                            border-4
                            ${index % 2 === 0 ? 'border-cyan-300' : 'border-red-500'}
                            bg-black
                            min-h-[220px]
                            transition
                        `}
                    >
                        <img
                            src={feature.features_image}
                            alt={feature.features_title}
                            className="w-full h-56 object-cover rounded-lg  md:mb-0 md:w-128 md:h-81"
                        />
                        <div className="flex-1 text-center md:text-left md:px-4">
                            <h3 className="text-2xl font-bold text-white mb-2 m-8">{feature.features_title}</h3>
                            <p className="text-gray-300 m-8">{feature.features_description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Features;

