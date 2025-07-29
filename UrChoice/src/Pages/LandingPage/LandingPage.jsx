import React from "react";
import { Helmet } from "react-helmet";

import LandingHeader from "../../Components/LandingHeader";
import HeroSection from "../../Components/HeroSection";
import Description from "../../Components/Description";
import CategoryCards from "../../Components/CategoryCards";

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

            <div className="min-h-[200vh] bg-black m-0 p-0 sm:min-h-[400vh]">
                <LandingHeader />
                <HeroSection />
                <Description />
                <CategoryCards />
            </div>
        </>
    );
}

export default LandingPage;
