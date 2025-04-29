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
  const { id_cat, id_room } = location.state || {};
  const [hasResetVotes, setHasResetVotes] = useState(false);


  const [usersInGame, setUsersInGame] = useState([]);

  /*aqui*/
  const fetchUsersInGame = async () => {
    try {
      const res = await fetch(
        `https://railwayserver-production-7692.up.railway.app/room/${id_room}/users`
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setUsersInGame(data);
        console.log("ID de la categoría recibido en GamePage:", id_cat,"Estos son los que estan dentro"); // 👈 Muestra el ID de la categoría
        console.table(data); // 👈 Muestra los usuarios en la consola
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  };
  useEffect(() => {
    fetchUsersInGame();
   
    // Si necesitas actualización en tiempo real:
    const interval = setInterval(fetchUsersInGame, 5000); // Cada 5 segundos
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (usersInGame.length > 0 && !hasResetVotes) {
      updateVote();
      setHasResetVotes(true); // Evita que se vuelva a ejecutar
    }
  }, [usersInGame]);
  
  const updateVote = async () => {
    if (!id_room || usersInGame.length === 0) return;
    
    try {
      // Crear un array de promesas para todas las actualizaciones
      const updatePromises = usersInGame.map(user => 
        fetch(`https://railwayserver-production-7692.up.railway.app/room/updateVote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_user: user.id_user,
            id_room: id_room,
            vote_game: '',
          }),
        })
      );
  
      // Esperar a que todas las actualizaciones se completen
      const responses = await Promise.all(updatePromises);
      
      // Verificar si todas las respuestas son OK
      const allOk = responses.every(res => res.ok);
      if (allOk) {
        console.log("Todos los votos se actualizaron correctamente");
        // Actualizar el estado local si es necesario
        setUsersInGame(usersInGame.map(user => ({ ...user, vote_game: '' })));
      } else {
        console.error("Error al actualizar algunos votos");
      }
    } catch (e) {
      console.error('Error en updateVote:', e);
    }
  };












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
          id_elem: element.id_elem,
          name_elem: element.name_elem,
          img_elem: `data:image/png;base64,${element.img_elem}`,
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