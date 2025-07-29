import FutbolImg from '../assets/Futbol.jpg';
import AiImg from '../assets/ai.jpg';
import DavinciImg from '../assets/davinci.jpg';

class Card {
    constructor(categoryName, categoryDescription, imagePath) {
        this.categoryName = categoryName;
        this.categoryDescription = categoryDescription;
        this.imagePath = imagePath;
    }
}

function CategoryCards() {
    const categories = [
        new Card("Football", "Choose your favourite football team", FutbolImg),
        new Card("Fate", "Choose the best servant", AiImg),
        new Card("Anime", "Choose the best anime in 2025", DavinciImg),
    ];

    return (
        <div className="absolute inset-x-0 top-168 w-full flex flex-col gap-8 items-center mt-8 md:flex-row md:justify-center md:items-start">
            {categories.map((category, index) => (
                <div key={index} className="w-11/12 max-w-md md:w-72 mx-auto">
                    <div className="rounded-lg shadow-lg p-0 flex flex-col items-center overflow-hidden">
                        <div className="relative w-full h-56 group">
                            <img
                                src={category.imagePath}
                                alt={category.categoryName}
                                className="rounded-lg w-full h-full object-cover transition duration-300 group-hover:brightness-50"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                <span className="text-xl font-bold mb-2 text-white drop-shadow">
                                    {category.categoryName}
                                </span>
                                <p className="text-gray-200 mb-4 text-center px-2">
                                    {category.categoryDescription}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CategoryCards;
