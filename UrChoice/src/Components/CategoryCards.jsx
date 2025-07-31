import FutbolImg from '../assets/Futbol.webp';
import AiImg from '../assets/ai.webp';
import DavinciImg from '../assets/davinci.webp';

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
    <div className="w-full flex flex-col gap-8 items-center mt-8 md:flex-row md:justify-center md:items-start">
      {categories.map((category, index) => (
        <div
          key={index}
          className="w-11/12 max-w-sm md:w-64 mx-auto cursor-pointer"
        >
          <div className="rounded-lg shadow-lg overflow-hidden flex flex-col items-center">
            <div className="relative w-full h-64 group">
              <picture>
                <source
                  srcSet={category.imagePath}
                  type="image/webp"
                />
                <img
                  src={category.imagePath}
                  alt={category.categoryName}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top rounded-lg transition duration-300 group-hover:brightness-50"
                />
              </picture>

              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black bg-opacity-50 p-4 text-center">
                <span className="text-xl font-bold text-white drop-shadow mb-2">
                  {category.categoryName}
                </span>
                <p className="text-gray-200 text-sm">
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
