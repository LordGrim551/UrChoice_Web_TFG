import '../Components/css/Descriptions.css'

function Description() {
  return (
    <div id="testimonial" className="flex flex-col items-center justify-center m-4 sm:m-8 md:m-12">
      <span className="text-white font-bold text-lg sm:text-xl md:text-2xl max-w-2xl text-center px-6 sm:px-8 md:px-12 leading-relaxed">
        “In UrChoice, create your own deck of cards with custom categories, play with friends, and discover the community’s favorite cards.”
      </span>
      <span className="w-full text-white font-extralight text-center mt-2 text-sm sm:text-base md:text-lg">
        "Development team"
      </span>
    </div>
  );
}

export default Description;
