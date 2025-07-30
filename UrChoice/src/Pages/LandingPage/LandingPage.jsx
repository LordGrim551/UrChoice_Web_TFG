import React from "react";
import { Helmet } from "react-helmet";
import Features from "../../Components/Features";
import LandingHeader from "../../Components/LandingHeader";
import HeroSection from "../../Components/HeroSection";
import Description from "../../Components/Description";
import CategoryCards from "../../Components/CategoryCards";
import Footer from "../../Components/Footer";
function LandingPage() {
    return (
        <>
            <Helmet>
                <title>UrChoice - Juego de cartas multijugador online</title>
                <meta
                    name="description"
                    content="UrChoice: juego de cartas multijugador online. Crea tu mazo, juega con amigos y descubre cartas populares."
                />
            </Helmet>

            {/* <div className="min-h-[100vh] bg-black m-0 p-0 sm:min-h-[200vh]"> */}
                <LandingHeader />
                <HeroSection />
                <Description />
                <CategoryCards />
                <Features />
                <Footer />
            {/* </div> */}
        </>
    );
}

export default LandingPage;
