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

  // Función para reiniciar todos los votos con logs
  const resetAllVotes = async () => {
    if (!id_room) return;

    try {
      console.log("🔁 Iniciando reset de todos los votos...");
      
      // Obtener todos los usuarios en la sala
      const res = await fetch(`${API_BASE_URL}/room/${id_room}/users`);
      const users = await res.json();
      
      if (!res.ok || !Array.isArray(users)) {
        console.error("❌ Error al obtener usuarios para resetear votos");
        return;
      }

      console.log("👥 Usuarios encontrados para resetear votos:", users.length);
      
      // Crear un array de promesas para actualizar todos los votos
      const resetPromises = users.map(user => {
        return fetch(`${API_BASE_URL}/room/updateVote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_user: user.id_user,
            id_room: id_room,
            vote_game: '',
          }),
        }).then(response => {
          if (!response.ok) {
            console.warn(`⚠️ No se pudo resetear voto para usuario ${user.id_user}`);
            return { success: false, user: user.id_user };
          }
          return { success: true, user: user.id_user };
        });
      });

      // Esperar a que todas las actualizaciones se completen
      const results = await Promise.all(resetPromises);
      
      // Mostrar tabla de resultados del reset
      console.table(results.map(r => ({
        Usuario: r.user,
        Estado: r.success ? "✅ Éxito" : "❌ Falló"
      })));

      // Actualizar el estado local
      setUsersInGame(prevUsers => 
        prevUsers.map(user => ({ ...user, vote_game: '' }))
      );
      setVoteGame('');
      
      console.log("🔄 Todos los votos han sido reiniciados");
      
    } catch (error) {
      console.error('❌ Error al reiniciar votos:', error);
    }
  };

  // Efectos para cargar datos iniciales
  useEffect(() => {
    console.log("🚀 Inicializando juego...");
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
    const interval = setInterval(fetchUsersInGame, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchAllVotes, 2000);
    return () => clearInterval(interval);
  }, [id_room]);

  useEffect(() => {
    if (elements.length > 0) {
      console.log("🃏 Elementos cargados, configurando ronda inicial");
      const indices = Array.from({ length: elements.length }, (_, i) => i);
      setCurrentRound(indices);
    }
  }, [elements]);

  useEffect(() => {
    if (vote_game && vote_game.trim() !== '') {
      console.log(`🗳️ Voto local cambiado a: ${vote_game}`);
      sendVoteToServer(vote_game);
    }
  }, [vote_game]);

  const fetchMostVotedImages = async () => {
    console.log("📊 Calculando imágenes más votadas...");
    const firstIndex = currentRound[currentMatchIndex];
    const secondIndex = currentRound[currentMatchIndex + 1];
    const firstElem = elements[firstIndex];
    const secondElem = elements[secondIndex];

    console.log("⚔️ Match actual:", {
      [firstElem.name_elem]: 0,
      [secondElem.name_elem]: 0
    });

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

    console.table([
      { Opción: firstElem.name_elem, Votos: voteCount[firstElem.name_elem] },
      { Opción: secondElem.name_elem, Votos: voteCount[secondElem.name_elem] }
    ]);

    const mostVotedName = voteCount[firstElem.name_elem] >= voteCount[secondElem.name_elem]
      ? firstElem.name_elem
      : secondElem.name_elem;

    console.log(`🏆 Más votado: ${mostVotedName}`);

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
      console.log("🔍 Buscando usuarios en el juego...");
      const res = await fetch(`${API_BASE_URL}/room/${id_room}/users`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        console.log(`👥 Usuarios en sala (${data.length}):`, data.map(u => u.id_user));
        setUsersInGame(data);
      } else {
        console.warn("⚠️ Respuesta inesperada al obtener usuarios");
      }
    } catch (e) {
      console.error('❌ Error fetching users:', e);
    }
  };

  const fetchElements = async () => {
    if (!id_cat) return;
    try {
      console.log("🖼️ Obteniendo elementos de la categoría...");
      const response = await fetch(`${API_BASE_URL}/elements/${id_cat}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`🃏 Elementos obtenidos: ${data.length}`);
        const formattedElements = data.map((element) => ({
          id_elem: element.id_elem,
          name_elem: element.name_elem,
          victories: element.victories,
          img_elem: `data:image/png;base64,${element.img_elem}`,
        }));
        setElements(formattedElements);
      }
    } catch (error) {
      console.error("❌ Error fetching elements:", error);
    }
  };

  const updateRanking = async (winnerElement, userId) => {
    try {
      if (!winnerElement || !userId) return;

      console.log(`🏆 Actualizando ranking para elemento ${winnerElement.name_elem} y usuario ${userId}`);

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

      console.log("📈 Ranking actualizado con éxito");
    } catch (error) {
      console.error('❌ Error en updateRanking:', error.message);
    }
  };

  const fetchAllVotes = async () => {
    try {
      console.log("🗳️ Obteniendo todos los votos...");
      const res = await fetch(`${API_BASE_URL}/room/${id_room}/users`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        // Mostrar tabla de votos actuales
        console.table(data.map(user => ({
          Usuario: user.id_user,
          Voto: user.vote_game || 'No votó'
        })));
        
        // Identificar usuarios que no han votado
        const nonVoters = data.filter(user => !user.vote_game || user.vote_game.trim() === '');
        if (nonVoters.length > 0) {
          console.warn("⚠️ Usuarios sin votar:", nonVoters.map(u => u.id_user));
        }
        
        setUsersInGame(data);
      }
    } catch (error) {
      console.error('❌ Error fetching votes:', error);
    }
  };

  const waitForAllVotes = async () => {
    console.log("⏳ Esperando que todos voten...");
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
            console.log("✅ Todos han votado!");
            setUsersInGame(data);
            setIsWaiting(false);
            return;
          } else {
            console.warn(`⏱️ Esperando votos de: ${nonVoters.map(u => u.id_user).join(', ')}`);
          }
        }
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.warn('⏰ Tiempo de espera agotado para los votos');
      setIsWaiting(false);
    } catch (error) {
      console.error('❌ Error en waitForAllVotes:', error);
      setIsWaiting(false);
    }
  };

  const handleClick = async (winnerIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setExpandedIndex(winnerIndex);
  
    // 1. Registrar el voto del jugador local
    const winnerElement = elements[winnerIndex];
    setVoteGame(winnerElement.name_elem);
    await sendVoteToServer(winnerElement.name_elem);
  
    // 2. Esperar a que todos voten
    await waitForAllVotes();
    
    // 3. Determinar el ganador REAL (global)
    const firstIndex = currentRound[currentMatchIndex];
    const secondIndex = currentRound[currentMatchIndex + 1];
    const firstElem = elements[firstIndex];
    const secondElem = elements[secondIndex];
  
    const voteCount = {
      [firstElem.name_elem]: 0,
      [secondElem.name_elem]: 0
    };
  
    usersInGame.forEach(user => {
      if (user.vote_game === firstElem.name_elem) voteCount[firstElem.name_elem]++;
      if (user.vote_game === secondElem.name_elem) voteCount[secondElem.name_elem]++;
    });
  
    // Determinar el verdadero ganador grupal
    const globalWinnerName = voteCount[firstElem.name_elem] >= voteCount[secondElem.name_elem] 
      ? firstElem.name_elem 
      : secondElem.name_elem;
    
    const globalWinnerIndex = globalWinnerName === firstElem.name_elem ? firstIndex : secondIndex;
  
    // 4. Actualizar el historial con el ganador REAL
    setMatchHistory(prev => [...prev, {
      winner: globalWinnerIndex,
      loser: globalWinnerIndex === firstIndex ? secondIndex : firstIndex,
      round: roundNumber
    }]);
  
    setMostVotedImages(prev => [...prev, {
      img: elements[globalWinnerIndex].img_elem,
      name: elements[globalWinnerIndex].name_elem,
      round: roundNumber
    }]);
  
    // 5. Avanzar con el ganador GRUPAL (no el local)
    setWinners((prev) => [...prev, globalWinnerIndex]);
    const nextMatch = currentMatchIndex + 2;
  
    if (nextMatch >= currentRound.length) {
      if (winners.length + 1 === 1) { // Solo queda un ganador
        setWinnerImage(elements[globalWinnerIndex].img_elem);
        setWinnerName(elements[globalWinnerIndex].name_elem);
        setIsWinnerDialogOpen(true);
        await updateRanking(elements[globalWinnerIndex], usersInGame[0]?.id_user);
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
      if (!user?.id_user) {
        console.warn("⚠️ Usuario no identificado para votar");
        return;
      }

      console.log(`📤 Enviando voto de ${user.id_user}: ${vote}`);
      
      const response = await fetch(`${API_BASE_URL}/room/updateVote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: user.id_user,
          id_room: id_room,
          vote_game: vote,
        }),
      });

      if (!response.ok) {
        console.warn(`⚠️ No se pudo registrar voto para usuario ${user.id_user}`);
        throw new Error('Error al actualizar el voto');
      }

      console.log(`✅ Voto registrado para ${user.id_user}`);
      
      // Actualizar el estado local
      setUsersInGame(prevUsers => 
        prevUsers.map(u => 
          u.id_user === user.id_user ? {...u, vote_game: vote} : u
        )
      );
      setVoteGame(vote);
      
    } catch (error) {
      console.error('❌ Error al enviar el voto:', error);
    }
  };

  const handleNextRoundComplete = async () => {
    console.log("🔄 Completando ronda...");
    try {
      await fetchAllVotes();
      await resetAllVotes();
      
      setCurrentRound([...winners]);
      setWinners([]);
      setCurrentMatchIndex(0);
      setShowNextRound(false);
      setRoundNumber(prev => prev + 1);
      
      console.log(`🆕 Nueva ronda #${roundNumber + 1} iniciada`);
    } catch (error) {
      console.error('❌ Error en handleNextRoundComplete:', error);
    }
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