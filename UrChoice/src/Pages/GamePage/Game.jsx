import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Game.css";
import NextRound from "../GamePage/NextRoundDialog/NextRound";
import WinnerDialog from "../GamePage/WinnerDialog/winner";

const GamePage = () => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [currentRound, setCurrentRound] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [winners, setWinners] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNextRound, setShowNextRound] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [matchHistory, setMatchHistory] = useState([]);

  const [isWinnerDialogOpen, setIsWinnerDialogOpen] = useState(false);
  const [winnerImage, setWinnerImage] = useState("");
  const [winnerName, setWinnerName] = useState("");


  const images = [
    "https://assets.codepen.io/1480814/archer.jpg",    
    "https://assets.codepen.io/1480814/saber.jpg",     
    "https://media.kg-portal.ru/anime/f/fatestaynight2014/images/fatestaynight2014_146.jpg",
    "https://i.pinimg.com/736x/18/70/93/187093f28d04b4df70dba5734a3ab308.jpg",
    "https://th.bing.com/th/id/OIP.vdxGIu1Pv87GjspBabTzMAAAAA?rs=1&pid=ImgDetMain",
    "https://th.bing.com/th/id/R.2e6b39f9288e09bab6abec1909b6a7e4?rik=AVjqMguNCXjQ3w&pid=ImgRaw&r=0",
    "https://th.bing.com/th/id/R.5c5e39bed56788fcbd4cb9622f3ceece?rik=XhyLTdIRu4NF2g&pid=ImgRaw&r=0",
    "https://th.bing.com/th/id/OIP.eyXkWaz9Qt6UskxDpbaZRAHaK7?rs=1&pid=ImgDetMain",
    "https://assets.codepen.io/1480814/archer.jpg",    
    "https://assets.codepen.io/1480814/saber.jpg",     
    "https://media.kg-portal.ru/anime/f/fatestaynight2014/images/fatestaynight2014_146.jpg",
    "https://i.pinimg.com/736x/18/70/93/187093f28d04b4df70dba5734a3ab308.jpg",
    "https://th.bing.com/th/id/OIP.vdxGIu1Pv87GjspBabTzMAAAAA?rs=1&pid=ImgDetMain",
    "https://th.bing.com/th/id/R.2e6b39f9288e09bab6abec1909b6a7e4?rik=AVjqMguNCXjQ3w&pid=ImgRaw&r=0",
    "https://th.bing.com/th/id/R.5c5e39bed56788fcbd4cb9622f3ceece?rik=XhyLTdIRu4NF2g&pid=ImgRaw&r=0",
    "https://th.bing.com/th/id/OIP.eyXkWaz9Qt6UskxDpbaZRAHaK7?rs=1&pid=ImgDetMain"
  ];
  const imageNames = [
    "Archer", "Saber", "Lancer", "Rider", "Assassin", "Berserker", "Caster", "Gilgamesh",
    "Archer1", "Saber2", "Lancer3", "Rider4", "Assassin5", "Berserker6", "Caster7Ganadora", "Gilgamesh8"
  ];

  useEffect(() => {
    const indices = Array.from({ length: images.length }, (_, i) => i);
    setCurrentRound(indices);
  }, [images.length]);

  const handleClick = (winnerIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setExpandedIndex(winnerIndex);

    const firstIndex = currentRound[currentMatchIndex];
    const secondIndex = currentRound[currentMatchIndex + 1];
    const loserIndex = winnerIndex === firstIndex ? secondIndex : firstIndex;

    setMatchHistory(prev => [...prev, {
      winner: winnerIndex,
      loser: loserIndex,
      round: roundNumber
    }]);

    setTimeout(() => {
      setWinners((prev) => [...prev, winnerIndex]);
      const nextMatch = currentMatchIndex + 2;

      if (nextMatch >= currentRound.length) {
        if (winners.length + 1 === 1) {
          // Fin del torneo
          setWinnerImage(images[winnerIndex]);
          setWinnerName(imageNames[winnerIndex]);
          setIsWinnerDialogOpen(true);
        } else {
          setShowNextRound(true);
        }
      } else {
        setCurrentMatchIndex(nextMatch);
      }

      setExpandedIndex(null);
      setIsAnimating(false);
    }, 1500);
  };

  const handleNextRoundComplete = () => {
    setCurrentRound([...winners]);
    setWinners([]);
    setCurrentMatchIndex(0);
    setShowNextRound(false);
    setRoundNumber(prev => prev + 1);
  };

  if (currentRound.length === 1) {
    navigate("/HomePage", { 
      state: { 
        winner: currentRound[0], 
        history: matchHistory 
      } 
    });
    return null;
  }

  const firstIndex = currentRound[currentMatchIndex];
  const secondIndex = currentRound[currentMatchIndex + 1];

  return (
    <div className="game-page relative min-h-screen bg-gray-900">
      {/* Área de juego */}
      <header className="pt-6 px-4 text-center">
        <span className="text-gray-300">Ronda {roundNumber} - Match {currentMatchIndex / 2 + 1} de {Math.ceil(currentRound.length / 2)}</span>
      </header>

      <div className={`gallery ${expandedIndex !== null ? "expanding" : ""} ${showNextRound ? "opacity-50" : ""}`}>
        {[firstIndex, secondIndex].map((globalIndex, idx) => (
          <div
            className={`item ${isAnimating ? "no-pointer" : ""}`}
            key={idx}
            onClick={() => !showNextRound && handleClick(globalIndex)}
          >
            <img
              src={images[globalIndex]}
              alt={imageNames[globalIndex]}
              className={`gallery-img 
                ${expandedIndex === globalIndex ? "expanded" : ""}
                ${expandedIndex !== null && expandedIndex !== globalIndex ? "grayscale" : ""}
                ${isAnimating ? "keep-hover" : ""}
              `}
            />
            <div className="label-container">
              <span className="label">{imageNames[globalIndex]}</span>
            </div>
          </div>
        ))}
      </div>

      {showNextRound && (
        <NextRound onComplete={handleNextRoundComplete} roundNumber={roundNumber} />
      )}

      {isWinnerDialogOpen && (
        <WinnerDialog 
          isOpen={isWinnerDialogOpen} 
          winnerImage={winnerImage} 
          winnerName={winnerName} 
          onClose={() => setIsWinnerDialogOpen(false)} 
        />
      )}

      <footer className="absolute bottom-0 w-full p-4 text-center text-gray-400 text-sm">
        Haz clic en tu carta favorita
      </footer>
    </div>
  );
};

export default GamePage;