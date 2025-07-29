import LandingHeader from "../../Components/LandingHeader";
import HeroSection from "../../Components/HeroSection";
import Description from "../../Components/Description";
import CategoryCards from "../../Components/CategoryCards";

function LandingPage() {
    return (
        <div className="min-h-[200vh] bg-black m-0 p-0 sm:min-h-[400vh]">
            <LandingHeader />
            <HeroSection />
            <Description />
            <CategoryCards />
        </div>
    );
}

export default LandingPage;