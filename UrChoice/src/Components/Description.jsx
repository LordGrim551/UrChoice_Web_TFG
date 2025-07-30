import '../Components/css/Descriptions.css'

function Description() {

  return (
    <>
      <div id="testimonial" className="flex flex-col items-center justify-center m-8 sm:m-16 md:m-32">
        <span className="text-white font-bold text-lg sm:text-xl md:text-2xl w-full max-w-2xl text-center px-4">
          “In UrChoice, create your own deck of cards with custom categories, play with friends, and discover the community’s favorite cards.”
        </span>
        <span className="w-full text-white font-extralight text-center mt-2">"Development team"</span>
      </div>
    </>
  );

}
export default Description;