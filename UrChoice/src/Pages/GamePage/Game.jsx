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
  const [globalRoundResults, setGlobalRoundResults] = useState([]);
  const [isShowingResults, setIsShowingResults] = useState(false);
  const [currentResults, setCurrentResults] = useState(null);

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

  // Efectos para cargar datos iniciales
  useEffect(() => {
    const initializeGame = async () => {
      if (id_cat) {
        await fetchElements();
        await fetchAllVotes();
        await resetAllVotes();
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

  // Nueva función para determinar ganadores globales
  const determineRoundWinners = async () => {
    const results = {};
    currentRound.forEach(index => {
      results[elements[index].name_elem] = 0;
    });

    usersInGame.forEach(user => {
      if (user.vote_game && results[user.vote_game] !== undefined) {
        results[user.vote_game]++;
      }
    });

    const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
    const winners = sorted.filter(([_, votes]) => votes > 0)
                         .slice(0, Math.ceil(sorted.length / 2))
                         .map(([name]) => elements.find(el => el.name_elem === name));

    const roundResult = {
      round: roundNumber,
      results: sorted,
      winners: winners.map(w => w.name_elem)
    };

    setCurrentResults(roundResult);
    setGlobalRoundResults(prev => [...prev, roundResult]);
    setIsShowingResults(true);

    return winners;
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

    await waitForAllVotes();
    const roundWinners = await determineRoundWinners();

    setWinners(roundWinners.map(w => elements.indexOf(w)));
    const nextMatch = currentMatchIndex + 2;

    if (nextMatch >= currentRound.length) {
      if (roundWinners.length === 1) {
        setWinnerImage(roundWinners[0].img_elem);
        setWinnerName(roundWinners[0].name_elem);
        setIsWinnerDialogOpen(true);
        await updateRanking(roundWinners[0], usersInGame[0]?.id_user);
      } else {
        setShowNextRound(true);
      }
    } else {
      setCurrentMatchIndex(nextMatch);
      await resetAllVotes();
    }

    setExpandedIndex(null);
    setIsAnimating(false);
  };

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

      if (!response.ok) throw new Error('Error al actualizar el voto');

      setUsersInGame(prevUsers => 
        prevUsers.map(u => 
          u.id_user === user.id_user ? {...u, vote_game: vote} : u
        )
      );
      setVoteGame(vote);
    } catch (error) {
      console.error('Error al enviar el voto:', error);
    }
  };

  const handleNextRoundComplete = async () => {
    try {
      await fetchAllVotes();
      await resetAllVotes();
      
      setCurrentRound([...winners]);
      setWinners([]);
      setCurrentMatchIndex(0);
      setShowNextRound(false);
      setRoundNumber(prev => prev + 1);
    } catch (error) {
      console.error('Error en handleNextRoundComplete:', error);
    }
  };

  const handleResultsClose = () => {
    setIsShowingResults(false);
    setCurrentResults(null);
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
        history: matchHistory,
        globalRoundResults
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

      {isShowingResults && currentResults && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              Resultados Ronda {currentResults.round}
            </h3>
            <ul className="space-y-2 mb-4">
              {currentResults.results.map(([name, votes]) => (
                <li key={name} className="flex justify-between items-center">
                  <span className="text-white">{name}</span>
                  <span className="text-gray-300">
                    {votes} votos {currentResults.winners.includes(name) ? '✅' : '❌'}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleResultsClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      <footer className="absolute bottom-0 w-full p-4 text-center text-gray-400 text-sm">
        Haz clic en tu carta favorita
      </footer>
    </div>
  );
};

export default GamePage;