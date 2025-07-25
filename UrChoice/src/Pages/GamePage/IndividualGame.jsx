import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Game.css";
import NextRound from "../GamePage/NextRoundDialog/NextRound";
import WinnerDialog from "../GamePage/WinnerDialog/winner";
import GameStartCountdown from "./GameStartCountdown/GameStartCountdown";
import WaitingDialog from "./WaitingDialog/waitingDialog";
// Constantes y URLs
const API_BASE_URL = "https://railwayserver-production-7692.up.railway.app";

const GamePage = () => {
  // Hooks de navegación y estado
  const navigate = useNavigate();
  const location = useLocation();
  const { id_cat, id_room } = location.state || {};
  console.log("Este es el id_room:", id_room);
  console.log("Este es el id_cat:", id_cat);

  // Estado del juego
  const [currentRound, setCurrentRound] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [winners, setWinners] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]);
  const [vote_game, setVoteGame] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  

  // Estado de la UI
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNextRound, setShowNextRound] = useState(false);
  const [showStartCountdown, setShowStartCountdown] = useState(true);

  // Estado del ganador
  const [isWinnerDialogOpen, setIsWinnerDialogOpen] = useState(false);
  const [winnerImage, setWinnerImage] = useState("");
  const [winnerName, setWinnerName] = useState("");


  // Estado de los elementos y usuarios
  const [elements, setElements] = useState([]);
  const [usersInGame, setUsersInGame] = useState([]);
  const [hasResetVotes, setHasResetVotes] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState('');
  const [userId, setUserId] = useState('');
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserId(parsedUser.id_user || '');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);





  // Efectos secundarios
  useEffect(() => {
    if (id_cat) {
      fetchElements();
    } else {
      console.error("id_cat is not available in the location state.");
    }
  }, [id_cat]);

  useEffect(() => {
    if (elements.length > 0) {
      const indices = Array.from({ length: elements.length }, (_, i) => i);
      setCurrentRound(indices);
    }
  }, [elements]);

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
  // Efecto para enviar el voto cuando cambie
  useEffect(() => {
    if (vote_game !== undefined) {
      sendVoteToServer(vote_game);
    }
  }, [vote_game]);


  // Funciones de la API
  const fetchUsersInGame = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/room/${id_room}/users`);
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

  const updateVote = async () => {
    if (!id_room || usersInGame.length === 0) return;

    try {
      const updatePromises = usersInGame.map(user =>
        fetch(`${API_BASE_URL}/room/updateVote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_user: user.id_user,
            id_room: id_room,
            vote_game: '',
          }),
        })
      );

      const responses = await Promise.all(updatePromises);
      const allOk = responses.every(res => res.ok);

      if (allOk) {
        console.log("Todos los votos se actualizaron correctamente");
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
      const response = await fetch(`${API_BASE_URL}/elements/${id_cat}`, {
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

  const updateRanking = async (winnerElement) => {
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
  
      // Actualizar GamesPlayed en el localStorage
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        const updatedUser = {
          ...parsedUser,
          GamesPlayed: (parsedUser.GamesPlayed || 0) + 1,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setGamesPlayed(updatedUser.GamesPlayed);
      }
  
      const response = await fetch(`${API_BASE_URL}/element/winner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_elem: winnerElement.id_elem,
          victories: winnerElement.victories + 1,
          id_user: userId, // Usar el userId del estado
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

  // Lógica del juego
  const handleClick = (winnerIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setExpandedIndex(winnerIndex);

    const firstIndex = currentRound[currentMatchIndex];
    const secondIndex = currentRound[currentMatchIndex + 1];
    const loserIndex = winnerIndex === firstIndex ? secondIndex : firstIndex;
    const winnerElement = elements[winnerIndex];
    setVoteGame(winnerElement.name_elem); // Guardar la imagen seleccionada
    setIsWaiting(true); // Mostrar el diálogo de espera
    setTimeout(() => {  
      setIsWaiting(false); // Ocultar el diálogo de espera después de 2 segundos
    }, 2000); // Simular un tiempo de espera antes de ocultar el diálogo

    setMatchHistory(prev => [...prev, {
      winner: winnerIndex,
      loser: loserIndex,
      round: roundNumber
    }]);

    setTimeout(() => {
      setWinners((prev) => [...prev, winnerIndex]);
      const nextMatch = currentMatchIndex + 2;

      if (nextMatch >= currentRound.length) {
        const winnerElement = elements[winnerIndex];
        if (winners.length + 1 === 1) {
          setWinnerImage(winnerElement.img_elem);
          setWinnerName(winnerElement.name_elem);

          setIsWinnerDialogOpen(true);

          console.log("GANADOR FINAL:", {
            id: winnerElement.id_elem,
            name: winnerElement.name_elem,
            img: winnerElement.img_elem,
            victories: winnerElement.victories
          });

          updateRanking(winnerElement);
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
  const resetVotes = async () => {
    try {
      const user = localStorage.getItem('user');
      const parsedUser = JSON.parse(user);

      if (!parsedUser || !parsedUser.id_user) return;

      const response = await fetch(`${API_BASE_URL}/room/updateVote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: parsedUser.id_user,
          id_room: id_room,
          vote_game: '', // Envía string vacío
        }),
      });

      if (response.ok) {
        console.log("Voto reseteado correctamente");
        setVoteGame(''); // Actualiza el estado local
      } else {
        console.error("Error al resetear el voto");
      }
    } catch (error) {
      console.error('Error al resetear el voto:', error);
    }
  };
  // Función para enviar voto (similar a la anterior)
  const sendVoteToServer = async (vote) => {
    try {
      const user = localStorage.getItem('user');
      const parsedUser = JSON.parse(user);

      if (!parsedUser || !parsedUser.id_user) return;

      const response = await fetch(`${API_BASE_URL}/room/updateVote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: parsedUser.id_user,
          id_room: id_room,
          vote_game: vote, // Recibe el valor a enviar
        }),
      });

      if (response.ok) {
        console.log("Voto actualizado correctamente");
      } else {
        console.error("Error al actualizar el voto");
      }
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
    resetVotes(); // Resetear votos al pasar de ronda
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

  // Preparación de datos para renderizado
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
        <NextRound
          onComplete={handleNextRoundComplete}
          roundNumber={roundNumber}
        />
      )}
       {isWaiting && (
        <WaitingDialog
          isOpen={isWaiting}
          message="Esperando a que los demás jugadores voten..."
          onClose={() => setIsWinnerDialogOpen(false)}
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