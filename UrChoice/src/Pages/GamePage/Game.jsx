import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Game.css";
import NextRound from "../GamePage/NextRoundDialog/NextRound";
import WinnerDialog from "../GamePage/WinnerDialog/winner";
import { useLocation } from 'react-router-dom';

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
  const [elements, setElements] = useState([]); // Cambiado de category a elements

  const location = useLocation();
  const { id_cat } = location.state || {};

  const fetchElements = async () => {
    console.log("Fetching elements for category ID:", id_cat);
    if (!id_cat) return;
    try {
      const response = await fetch(`https://railwayserver-production-7692.up.railway.app/elements/${id_cat}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      console.log("Fetched elements:", data);
      if (response.ok) {
        const formattedElements = data.map((element) => ({
          id_elem: element.id_element,
          name_elem: element.name,
          img_elem: `data:image/png;base64,${element.image_url}`,
        }));
        setElements(formattedElements); // Actualizado para usar setElements
      } else {
        console.error("Error fetching elements:", data.message);
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  useEffect(() => {
    if (id_cat) {
      fetchElements();
    } else {
      console.error("id_cat is not available in the location state.");
    }
  }, [id_cat]);

  useEffect(() => {
    console.log("Elements Data:", elements);
  }, [elements]);

  useEffect(() => {
    if (elements.length > 0) {
      const indices = Array.from({ length: elements.length }, (_, i) => i);
      setCurrentRound(indices);
    }
  }, [elements]);

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
          const winnerElement = elements[winnerIndex]; // Usando elements
          setWinnerImage(winnerElement.img_elem);
          setWinnerName(winnerElement.name_elem);
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

  if (elements.length === 0) {
    return <div className="text-white text-center mt-8">Cargando cartas...</div>;
  }

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
      <header className="pt-6 px-4 text-center">
        <span className="text-gray-300">Ronda {roundNumber} - Match {currentMatchIndex / 2 + 1} de {Math.ceil(currentRound.length / 2)}</span>
      </header>

      <div className={`gallery ${expandedIndex !== null ? "expanding" : ""} ${showNextRound ? "opacity-50" : ""}`}>
        {[firstIndex, secondIndex].map((globalIndex, idx) => {
          const element = elements[globalIndex];
          if (!element) return null;

          return (
            <div
              className={`item ${isAnimating ? "no-pointer" : ""}`}
              key={idx}
              onClick={() => !showNextRound && handleClick(globalIndex)}
            >
              <img
                src={element.img_elem}
                alt={element.name_elem}
                className={`gallery-img 
                  ${expandedIndex === globalIndex ? "expanded" : ""}
                  ${expandedIndex !== null && expandedIndex !== globalIndex ? "grayscale" : ""}
                  ${isAnimating ? "keep-hover" : ""}
                `}
              />
              <div className="label-container">
                <span className="label">{element.name_elem}</span>
              </div>
            </div>
          );
        })}
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