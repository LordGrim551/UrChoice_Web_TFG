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
  const [winners, setWinners] = useState([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [matchHistory, setMatchHistory] = useState([]);
  const [vote_game, setVoteGame] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [mostVotedImages, setMostVotedImages] = useState([]);

  // Estados de UI
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNextRound, setShowNextRound] = useState(false);
  const [showStartCountdown, setShowStartCountdown] = useState(true);

  // Estados del ganador
  const [isWinnerDialogOpen, setIsWinnerDialogOpen] = useState(false);
  const [winnerImage, setWinnerImage] = useState("");
  const [winnerName, setWinnerName] = useState("");

  // Estados de usuarios y sala
  const [usersInGame, setUsersInGame] = useState([]);
  const [hasResetVotes, setHasResetVotes] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState('');

  // Función para reiniciar todos los votos
  const resetAllVotes = async () => {
    if (!id_room) return;

    try {
      // Obtener todos los usuarios en la sala
      const res = await fetch(`${API_BASE_URL}/room/${id_room}/users`);
      const users = await res.json();
      
      if (!res.ok || !Array.isArray(users)) return;

      // Crear un array de promesas para actualizar todos los votos
      const resetPromises = users.map(user => {
        return fetch(`${API_BASE_URL}/room/updateVote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_user: user.id_user,
            id_room: id_room,
            vote_game: '', // Establecer vote_game como string vacío
          }),
        });
      });

      // Esperar a que todas las actualizaciones se completen
      await Promise.all(resetPromises);
      console.log("Todos los votos han sido reiniciados");
      
      // Actualizar el estado local
      setUsersInGame(prevUsers => 
        prevUsers.map(user => ({ ...user, vote_game: '' }))
      );
      setVoteGame('');
      
    } catch (error) {
      console.error('Error al reiniciar votos:', error);
    }
  };

  // Efectos para cargar datos iniciales
  useEffect(() => {
    const initializeGame = async () => {
      if (id_cat) {
        await fetchElements();
        await fetchAllVotes();
        await resetAllVotes(); // Reiniciar votos al inicio
      }
    };
    
    initializeGame();
  }, [id_cat]);

  useEffect(() => {
    fetchUsersInGame();
    const interval = setInterval(fetchUsersInGame, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchAllVotes, 2000);
    return () => clearInterval(interval);
  }, [id_room]);

  useEffect(() => {
    if (elements.length > 0) {
      const indices = Array.from({ length: elements.length }, (_, i) => i);
      setCurrentRound(indices);
    }
  }, [elements]);

  useEffect(() => {
    if (vote_game && vote_game.trim() !== '') {
      sendVoteToServer(vote_game);
    }
  }, [vote_game]);

  const fetchMostVotedImages = async () => {
    const firstIndex = currentRound[currentMatchIndex];
    const secondIndex = currentRound[currentMatchIndex + 1];
    const firstElem = elements[firstIndex];
    const secondElem = elements[secondIndex];

    const voteCount = {
      [firstElem.name_elem]: 0,
      [secondElem.name_elem]: 0
    };

    usersInGame.forEach(user => {
      if (user.vote_game === firstElem.name_elem) {
        voteCount[firstElem.name_elem]++;
      } else if (user.vote_game === secondElem.name_elem) {
        voteCount[secondElem.name_elem]++;
      }
    });

    const mostVotedName = voteCount[firstElem.name_elem] >= voteCount[secondElem.name_elem]
      ? firstElem.name_elem
      : secondElem.name_elem;

    const mostVotedElement = elements.find(el => el.name_elem === mostVotedName);

    if (mostVotedElement) {
      setMostVotedImages(prev => [...prev, {
        img: mostVotedElement.img_elem,
        name: mostVotedElement.name_elem,
        round: roundNumber
      }]);
    }
  };

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

  const fetchElements = async () => {
    if (!id_cat) return;
    try {
      const response = await fetch(`${API_BASE_URL}/elements/${id_cat}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
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

  const updateRanking = async (winnerElement, userId) => {
    try {
      if (!winnerElement || !userId) return;

      const user = localStorage.getItem('user');
      const parsedUser = JSON.parse(user);
      setGamesPlayed(parsedUser.GamesPlayed + 1);

      const updatedUser = {
        ...parsedUser,
        GamesPlayed: parsedUser.GamesPlayed + 1,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      const response = await fetch(`${API_BASE_URL}/element/winner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_elem: winnerElement.id_elem,
          victories: winnerElement.victories + 1,
          id_user: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar ranking');
      }
    } catch (error) {
      console.error('Error en updateRanking:', error.message);
    }
  };

  const fetchAllVotes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/room/${id_room}/users`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setUsersInGame(data);
      }
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  const waitForAllVotes = async () => {
    let allVoted = false;
    while (!allVoted) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const res = await fetch(`${API_BASE_URL}/room/${id_room}/users`);
      const data = await res.json();
      allVoted = data.every(user => user.vote_game && user.vote_game.trim() !== '');
    }
    setIsWaiting(false);
  };

  const handleClick = async (winnerIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setExpandedIndex(winnerIndex);

    const winnerElement = elements[winnerIndex];
    setVoteGame(winnerElement.name_elem);
    await sendVoteToServer(winnerElement.name_elem);

    const firstIndex = currentRound[currentMatchIndex];
    const secondIndex = currentRound[currentMatchIndex + 1];
    const loserIndex = winnerIndex === firstIndex ? secondIndex : firstIndex;

    setMatchHistory(prev => [...prev, {
      winner: winnerIndex,
      loser: loserIndex,
      round: roundNumber
    }]);

    setIsWaiting(true);
    await waitForAllVotes();
    await fetchMostVotedImages();

    setWinners((prev) => [...prev, winnerIndex]);
    const nextMatch = currentMatchIndex + 2;

    if (nextMatch >= currentRound.length) {
      if (winners.length + 1 === 1) {
        setWinnerImage(winnerElement.img_elem);
        setWinnerName(winnerElement.name_elem);
        setIsWinnerDialogOpen(true);
        await updateRanking(winnerElement, usersInGame[0]?.id_user);
      } else {
        setShowNextRound(true);
      }
    } else {
      setCurrentMatchIndex(nextMatch);
      await resetAllVotes(); // Reiniciar votos al pasar al siguiente match
    }

    setExpandedIndex(null);
    setIsAnimating(false);
  };

  const sendVoteToServer = async (vote) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.id_user) return;

      await fetch(`${API_BASE_URL}/room/updateVote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: user.id_user,
          id_room: id_room,
          vote_game: vote,
        }),
      });
    } catch (error) {
      console.error('Error al enviar el voto:', error);
    }
  };

  const handleNextRoundComplete = () => {
    setCurrentRound([...winners]);
    setWinners([]);
    setCurrentMatchIndex(0);
    setShowNextRound(false);
    setRoundNumber(prev => prev + 1);
    resetAllVotes(); // Reiniciar todos los votos al pasar a la siguiente ronda
  };

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
        history: matchHistory
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