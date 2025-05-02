import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Game.css";
import NextRound from "../GamePage/NextRoundDialog/NextRound";
import WinnerDialog from "../GamePage/WinnerDialog/winner";
import GameStartCountdown from "./GameStartCountdown/GameStartCountdown";
import WaitingDialog from "./WaitingDialog/waitingDialog";

const API_BASE_URL = "https://railwayserver-production-7692.up.railway.app";

const GamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id_cat, id_room } = location.state || {};

  // Estados del juego
  const [elements, setElements] = useState([]);
  const [currentRound, setCurrentRound] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [matchHistory, setMatchHistory] = useState([]);
  const [vote_game, setVoteGame] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [globalWinners, setGlobalWinners] = useState([]);
  const [showNextRound, setShowNextRound] = useState(false);
  const [showStartCountdown, setShowStartCountdown] = useState(true);
  const [isWinnerDialogOpen, setIsWinnerDialogOpen] = useState(false);
  const [winnerImage, setWinnerImage] = useState("");
  const [winnerName, setWinnerName] = useState("");
  const [usersInGame, setUsersInGame] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Obtener elementos de la categoría
  const fetchElements = async () => {
    if (!id_cat) return;
    try {
      const response = await fetch(`${API_BASE_URL}/elements/${id_cat}`);
      const data = await response.json();
      if (response.ok) {
        const formattedElements = data.map((element) => ({
          id_elem: element.id_elem,
          name_elem: element.name_elem,
          victories: element.victories,
          img_elem: `data:image/png;base64,${element.img_elem}`,
        }));
        setElements(formattedElements);
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  // Obtener usuarios en la sala
  const fetchUsersInGame = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/room/${id_room}/users`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setUsersInGame(data);
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  };

  // Reiniciar todos los votos
  const resetAllVotes = async () => {
    if (!id_room) return;
    try {
      const res = await fetch(`${API_BASE_URL}/room/${id_room}/users`);
      const users = await res.json();
      
      if (!res.ok || !Array.isArray(users)) return;

      const resetPromises = users.map(user => {
        return fetch(`${API_BASE_URL}/room/updateVote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_user: user.id_user,
            id_room: id_room,
            vote_game: '',
          }),
        });
      });

      await Promise.all(resetPromises);
      setUsersInGame(prevUsers => prevUsers.map(user => ({ ...user, vote_game: '' })));
      setVoteGame('');
    } catch (error) {
      console.error('Error al reiniciar votos:', error);
    }
  };

  // Determinar ganadores globales
  const getGlobalWinners = () => {
    const winnersMap = {};
    const matchesInRound = Math.floor(currentRound.length / 2);
    
    for (let i = 0; i < matchesInRound; i++) {
      const firstIndex = currentRound[i * 2];
      const secondIndex = currentRound[i * 2 + 1];
      
      if (firstIndex === undefined || secondIndex === undefined) continue;

      const firstElem = elements[firstIndex];
      const secondElem = elements[secondIndex];

      const votesFirst = usersInGame.filter(u => u.vote_game === firstElem.name_elem).length;
      const votesSecond = usersInGame.filter(u => u.vote_game === secondElem.name_elem).length;

      const winnerIndex = votesFirst >= votesSecond ? firstIndex : secondIndex;
      winnersMap[winnerIndex] = true;
    }

    return Object.keys(winnersMap).map(Number);
  };

  // Enviar voto al servidor
  const sendVoteToServer = async (vote) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.id_user) return;

      const response = await fetch(`${API_BASE_URL}/room/updateVote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: user.id_user,
          id_room: id_room,
          vote_game: vote,
        }),
      });

      if (response.ok) {
        setUsersInGame(prevUsers => 
          prevUsers.map(u => 
            u.id_user === user.id_user ? {...u, vote_game: vote} : u
          )
        );
      }
    } catch (error) {
      console.error('Error al enviar el voto:', error);
    }
  };

  // Esperar a que todos voten
  const waitForAllVotes = async () => {
    setIsWaiting(true);
    let attempts = 0;
    const maxAttempts = 10;

    try {
      while (attempts < maxAttempts) {
        const res = await fetch(`${API_BASE_URL}/room/${id_room}/users`);
        const data = await res.json();
        
        if (res.ok && Array.isArray(data)) {
          const nonVoters = data.filter(user => !user.vote_game || user.vote_game.trim() === '');
          
          if (nonVoters.length === 0) {
            setUsersInGame(data);
            setIsWaiting(false);
            return;
          }
        }
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setIsWaiting(false);
    } catch (error) {
      console.error('Error en waitForAllVotes:', error);
      setIsWaiting(false);
    }
  };

  // Manejar clic en una carta
  const handleClick = async (winnerIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setExpandedIndex(winnerIndex);

    const winnerElement = elements[winnerIndex];
    setVoteGame(winnerElement.name_elem);
    await sendVoteToServer(winnerElement.name_elem);

    await waitForAllVotes();
    const newGlobalWinners = getGlobalWinners();
    setGlobalWinners(newGlobalWinners);

    const nextMatch = currentMatchIndex + 2;

    if (nextMatch >= currentRound.length) {
      if (newGlobalWinners.length === 1) {
        setWinnerImage(elements[newGlobalWinners[0]].img_elem);
        setWinnerName(elements[newGlobalWinners[0]].name_elem);
        setIsWinnerDialogOpen(true);
      } else {
        setShowNextRound(true);
      }
    } else {
      setCurrentMatchIndex(nextMatch);
    }

    setIsAnimating(false);
  };

  // Pasar a la siguiente ronda
  const handleNextRoundComplete = async () => {
    await resetAllVotes();
    setCurrentRound(globalWinners);
    setCurrentMatchIndex(0);
    setShowNextRound(false);
    setRoundNumber(prev => prev + 1);
  };

  // Efectos iniciales
  useEffect(() => {
    const initializeGame = async () => {
      if (id_cat) {
        await fetchElements();
        await fetchUsersInGame();
        await resetAllVotes();
      }
    };
    initializeGame();
  }, [id_cat]);

  useEffect(() => {
    if (elements.length > 0) {
      const indices = Array.from({ length: elements.length }, (_, i) => i);
      setCurrentRound(indices);
    }
  }, [elements]);

  useEffect(() => {
    const interval = setInterval(fetchUsersInGame, 5000);
    return () => clearInterval(interval);
  }, []);

  // Renderizado condicional
  if (showStartCountdown || elements.length === 0) {
    return (
      <>
        {showStartCountdown ? (
          <GameStartCountdown onComplete={() => setShowStartCountdown(false)} />
        ) : (
          <div className="text-white text-center mt-8">Cargando cartas...</div>
        )}
      </>
    );
  }

  if (currentRound.length === 1) {
    navigate("/HomePage", {
      state: {
        winner: currentRound[0],
        history: matchHistory,
        globalWinners
      }
    });
    return null;
  }

  const firstIndex = currentRound[currentMatchIndex];
  const secondIndex = currentRound[currentMatchIndex + 1];
  const matchesCount = Math.ceil(currentRound.length / 2);
  const currentMatch = currentMatchIndex / 2 + 1;

  return (
    <div className="game-page relative min-h-screen bg-gray-900">
      <header className="pt-6 px-4 text-center">
        <span className="text-gray-300">
          Ronda {roundNumber} - Match {currentMatch} de {matchesCount}
        </span>
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

      {isWaiting && (
        <WaitingDialog
          isOpen={isWaiting}
          message="Esperando a que todos los jugadores voten..."
          onClose={() => {}}
          showCloseButton={false}
        />
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