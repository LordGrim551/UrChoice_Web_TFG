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

  // Efectos para cargar datos iniciales
  useEffect(() => {
    if (id_cat) {
      fetchElements();
      fetchAllVotes();
      // VIGILANCIA
    } else {
      console.error("id_cat is not available in the location state.");
    }
  }, [id_cat]);

  useEffect(() => {
    fetchUsersInGame();
    const interval = setInterval(fetchUsersInGame, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (usersInGame.length > 0 && !hasResetVotes) {
      updateVote();
      setHasResetVotes(true);
    }
  }, [usersInGame]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isWaiting) {
        fetchAllVotes();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isWaiting, id_room]);

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

  useEffect(() => {
    if (isWaiting) {
      const allVoted = usersInGame.every(user => user.vote_game && user.vote_game.trim() !== '');
      fetchAllVotes();
      if (allVoted) {
        updateVote();
        fetchAllVotes();
      }
    }
  }, [usersInGame, isWaiting]); // Se ejecutará cuando cambien los usuarios o el estado de espera

  // Función para obtener las imágenes más votadas
  const fetchMostVotedImages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/room/WinnerRound/${id_room}`);
      const data = await response.json();

      if (response.ok) {
        const mostVotedGame = data.mostVotedGame;
        const votedElement = elements.find(el => el.name_elem === mostVotedGame);

        if (votedElement) {
          setMostVotedImages(prev => [...prev, {
            img: votedElement.img_elem,
            name: votedElement.name_elem,
            round: roundNumber
          }]);
        }
      }
    } catch (error) {
      console.error('Error fetching most voted images:', error);
    }
  };

  const fetchUsersInGame = async () => {
    try {
      const res = await fetch(
        `https://railwayserver-production-7692.up.railway.app/room/${id_room}/users`
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setUsersInGame(data);
        console.log("ID de la categoría recibido en GamePage:", id_cat);
        console.table(data);
      }
    } catch (e) {
      console.error('Error fetching users:', e);
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
          victories: element.victories,
          img_elem: `data:image/png;base64,${element.img_elem}`,
        }));
        setElements(formattedElements);
      } else {
        console.error("Error fetching elements:", data.message);
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

const updateVote = async () => {
  if (!id_room || usersInGame.length === 0) return;

  try {
    setUsersInGame(usersInGame.map(user => ({ ...user, vote_game: '' })));
    setVoteGame('');
    fetchAllVotes();
    // VIGILANCIA

    const updatePromises = usersInGame.map(async user =>
      await fetch(`${API_BASE_URL}/room/updateVote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: user.id_user, // ✅ usar el ID de cada usuario
          id_room: id_room,
          vote_game: '',
        }),
      })
    );

    await Promise.all(updatePromises);
    console.log("Todos los votos se actualizaron correctamente");
  } catch (e) {
    console.error('Error en updateVote:', e);
  }
};


  const updateRanking = async (winnerElement, userId) => {
    try {
      if (!winnerElement || !userId) {
        console.error("Datos faltantes para actualizar ranking");
        return;
      }

      console.log("Actualizando ranking para:", {
        elementId: winnerElement.id_elem,
        userId: userId,
        currentVictories: winnerElement.victories
      });

      const user = localStorage.getItem('user');
      const parsedUser = JSON.parse(user);
      setGamesPlayed(parsedUser.GamesPlayed + 1);

      const updatedUser = {
        ...parsedUser,
        GamesPlayed: parsedUser.GamesPlayed + 1,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      const response = await fetch(`https://railwayserver-production-7692.up.railway.app/element/winner`, {
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
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.message || 'Error al actualizar ranking');
      }
      console.log("Ranking actualizado exitosamente");
    } catch (error) {
      console.error('Error en updateRanking:', error.message);
    }
  };

  const fetchAllVotes = async () => {
    try {
      const res = await fetch(
        `https://railwayserver-production-7692.up.railway.app/room/${id_room}/users`
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        console.log("Votos de todos los usuarios:", data);

        const allUsersVoted = data.every(user =>
          user.vote_game && user.vote_game.trim() !== ''
        );

        if (allUsersVoted) {
          setIsWaiting(false);
          setVoteGame("");
        }

        data.forEach(user => {
          console.log(`Usuario ${user.id_user} votó por: ${user.vote_game}`);
        });
      }
    } catch (e) {
      console.error('Error fetching votes:', e);
    }
  };

  const handleClick = async (winnerIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setExpandedIndex(winnerIndex);

    

    const winnerElement = elements[winnerIndex];
    // Actualizar estado local y enviar voto de manera síncrona
    await new Promise(resolve => {
      setVoteGame(winnerElement.name_elem);
      setTimeout(resolve, 100); // Pequeño delay para asegurar la actualización
    });
    await sendVoteToServer(winnerElement.name_elem);

    const firstIndex = currentRound[currentMatchIndex];
    const secondIndex = currentRound[currentMatchIndex + 1];
    const loserIndex = winnerIndex === firstIndex ? secondIndex : firstIndex;

    setMatchHistory(prev => [...prev, {
      winner: winnerIndex,
      loser: loserIndex,
      round: roundNumber
    }]);

    setTimeout(async () => {
      setWinners((prev) => [...prev, winnerIndex]);
      const nextMatch = currentMatchIndex + 2;

      if (nextMatch >= currentRound.length) {
        const winnerElement = elements[winnerIndex];

        if (winners.length + 1 === 1) {
          await fetchMostVotedImages();
        
          setTimeout(() => {
        
            setWinnerImage(winnerElement.img_elem);
            setWinnerName(winnerElement.name_elem);
            setIsWinnerDialogOpen(true);
            updateRanking(winnerElement, usersInGame[0]?.id_user);
          }, 3000);
        } else {
          await fetchMostVotedImages();
        
          setTimeout(() => {
         
            setShowNextRound(true);
            setIsWaiting(true);
            console.log('Aqui 1')
          }, 3000);

        }
      } else {
            /*ESTO FUNCIONA*/
        setIsWaiting(true);
        setCurrentMatchIndex(nextMatch);
        console.log('Aqui 2')
      
      }

      setExpandedIndex(null);
      setIsAnimating(false);
    }, 1500);
  };

  const sendVoteToServer = async (vote) => {
    if (!vote || vote.trim() === '') return;

    try {
      const user = localStorage.getItem('user');
      if (!user) return;

      const parsedUser = JSON.parse(user);
      if (!parsedUser.id_user) return;
      fetchAllVotes();
      // POSIBLE VIGILANCIA
      // PARA SOLUCIONAR EL NO ACTUALIZAR VOTOS INICIALES

      const response = await fetch(`${API_BASE_URL}/room/updateVote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: parsedUser.id_user,
          id_room: id_room,
          vote_game: vote,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el voto');
      }

      console.log("Voto actualizado correctamente:", vote);

      // Verificar que el voto se actualizó correctamente
      const verifyResponse = await fetch(`${API_BASE_URL}/room/${id_room}/users`);
      const usersData = await verifyResponse.json();
      const currentUser = usersData.find(u => u.id_user === parsedUser.id_user);

      if (currentUser && currentUser.vote_game !== vote) {
        console.warn("El voto no se actualizó correctamente en el servidor");
        // Reintentar si falló
        await sendVoteToServer(vote);
      }
    } catch (error) {
      console.error('Error al enviar el voto:', error);
      // Podrías implementar un reintento aquí
    }
  };

  const handleNextRoundComplete = () => {
    setCurrentRound([...winners]);
    setWinners([]);
    setCurrentMatchIndex(0);
    setShowNextRound(false);
    setIsWaiting(false);
    setRoundNumber(prev => prev + 1);
    setVoteGame("");
    updateVote();
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
          onClose={() => { }}
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