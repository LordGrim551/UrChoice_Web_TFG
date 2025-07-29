import LandingHeader from "../../Components/LandingHeader";
import HeroSection from "../../Components/HeroSection";
import Description from "../../Components/Description";
import CategoryCards from "../../Components/CategoryCards";
import '../LandingPage/LandingPage.css';
function LandingPage() {
    return (
        <>
            <LandingHeader></LandingHeader>
            <HeroSection></HeroSection>
            <Description></Description>
            <CategoryCards></CategoryCards>
        </>

    )
}

export default LandingPage;