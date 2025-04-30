import React, { useState, useEffect } from 'react';
import { Trash, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoomDialog = ({ dialogRef, selectedRoom, currentUserId }) => {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState(currentUserId);
    const [isUserInTable, setIsUserInTable] = useState(true);
    const navigate = useNavigate(); 

   

    const checkAllReady = () => {
        if (users.length > 0 && users.every(user => user.vote_game === 'LISTO')) {
            navigate('/GamePage', { 
                state: { 
                  id_cat: selectedRoom.id_cat,
                  id_room: selectedRoom.id_room // 👈 Añade esto
                } 
              },
              
            
            
        
        );
            startMatch(); // Inicia la partida
        }
    };
     // Efecto que verifica constantemente si todos están listos
     useEffect(() => {
        checkAllReady();
    }, [users]); // Se ejecuta cada vez que cambia 'users'

    

    // Si no viene por props, obtenemos userId de localStorage
    useEffect(() => {
        if (!userId) {
            const stored = localStorage.getItem('id_user');
            if (stored) setUserId(stored);
        }
    }, [userId]);

    // Función para iniciar el juego
    const startMatch = async () => {
        if (!selectedRoom?.id_room) return;
        try {
            const res = await fetch(
                `https://railwayserver-production-7692.up.railway.app/room/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_room: selectedRoom.id_room,
                    id_user: userId,
                }),
            }
            );
            
            if (res.ok) {
                const data = await res.json();
                if (data.message === 'La sala se ha cerrado correctamente') {
                    console.table(selectedRoom); // 👈 Esto para ver todo el selectedRoom
                    // Redirige a la página de juego
                    navigate('/GamePage', {
                        state: { id_cat: selectedRoom.id_cat, id_room: selectedRoom.id_room },
                      });
                      
                }
            } else {
                console.error('Error al iniciar partida:', await res.json());
            }
        } catch (e) {
            console.error('Fetch startMatch error:', e);
        }
    };


    const closeDialog = () => {
        dialogRef.current?.close();
    };

    const fetchUsers = async () => {
        if (!selectedRoom?.id_room) return;
        try {
            const res = await fetch(
                `https://railwayserver-production-7692.up.railway.app/room/${selectedRoom.id_room}/users`
            );
           console.log("ID de la categoría recibido en RoomDialog:", selectedRoom?.id_cat); 
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                // ¿Está nuestro userId en la lista?
                const inTable = data.some(u => u.id_user == userId);
                setIsUserInTable(inTable);
                setUsers(data);
                console.log("ID de la categoría recibido en RoomDialog:", selectedRoom?.id_cat);
            } else {
                console.error('Error al obtener usuarios:', data);
            }
        } catch (e) {
            console.error('Fetch users error:', e);
        }
    };

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 1000);
        return () => clearInterval(interval);
    }, [selectedRoom]);

    const updateVote = async () => {
        if (!userId || !selectedRoom?.id_room) return;
        try {
            const res = await fetch(
                `https://railwayserver-production-7692.up.railway.app/room/updateVote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_user: userId,
                    id_room: selectedRoom.id_room,
                    vote_game: 'LISTO',
                }),
            }
            );
            if (res.ok) {
                // Reflejar localmente
                setUsers(users.map(u =>
                    u.id_user === userId ? { ...u, vote_game: 'LISTO' } : u
                ));
            } else {
                console.error('Error updateVote:', await res.json());
            }
        } catch (e) {
            console.error('Fetch updateVote error:', e);
        }
    };

    const handleKickUser = async (userToKick) => {
        if (!selectedRoom?.id_room || !userToKick) return;
        try {
            const res = await fetch(
                `https://railwayserver-production-7692.up.railway.app/room/end`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_room: selectedRoom.id_room,
                    id_user: userToKick,
                }),
            }
            );
            if (res.ok) {
                setUsers(users.filter(u => u.id_user !== userToKick));
            } else {
                console.error('Error expulsar usuario:', await res.json());
            }
        } catch (e) {
            console.error('Fetch kick error:', e);
        }
    };
  

    // Renderiza Admin o Trash según idx y si eres Admin
    const renderUserInfo = (user, idx) => {
        // Índice 0 siempre Admin
        if (idx === 0) {
            return <span className="text-yellow-400 font-bold">Admin</span>;
        }
        // Para idx>0, solo si el logueado ES el Admin (users[0])
        const adminId = users[0]?.id_user;
        if (adminId == userId) {
            return (
                <Trash
                    className="w-auto h-auto text-red-600 cursor-pointer hover:text-red-800"
                    onClick={() => handleKickUser(user.id_user)}
                />
            );
        }
        return null;
    };

    // Si te han expulsado, mostramos mensaje
    if (!isUserInTable) {
        return (
            <dialog ref={dialogRef} className="w-2xl overflow-y-auto scrollbar-custom dialog bg-black border rounded-3xl border-cyan-400 p-4 shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-center">
                    <h2 className="text-lg font-bold mb-4 text-red-500">
                        ME HAN EXPULSADO
                    </h2>
                    <button
                        onClick={closeDialog}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        Cerrar
                    </button>
                </div>
            </dialog>
        );
    }

    return (
        <dialog ref={dialogRef} className="w-2xl overflow-y-auto scrollbar-custom dialog bg-black border rounded-3xl border-cyan-400 p-4 shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h2 className="text-lg font-bold mb-4 text-white">
                Usuarios en la sala {selectedRoom?.name_room}
            </h2>
            <div className="space-y-4 max-h-64 overflow-y-auto">
                {users.map((user, idx) => (
                    <div key={user.id_user} className="flex items-center justify-between border-b border-gray-600 pb-2">
                        <span className="text-gray-300 font-medium">
                            {user.nick_user}
                        </span>
                        <div className="flex gap-4 items-center">
                            {renderUserInfo(user, idx)}
                            {user.vote_game === 'LISTO' && (
                                <Check className="w-auto h-auto text-green-500" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-4 mt-6">
                <button
                    onClick={() => {
                        handleKickUser(userId); // Expulsar al usuario actual
                        closeDialog(); // Cerrar el diálogo después de salir
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    Cerrar
                </button>
                <button
                    onClick={updateVote}
                    disabled={users.find(u => u.id_user == userId)?.vote_game === 'LISTO'}
                    className={`px-4 py-2 rounded ${users.find(u => u.id_user == userId)?.vote_game === 'LISTO'
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-cyan-500 hover:bg-cyan-600'
                        } text-white`}
                >
                    {users.find(u => u.id_user == userId)?.vote_game === 'LISTO'
                        ? 'Ya estás listo'
                        : 'Listo'}
                </button>
            </div>
        </dialog>
    );
};

export default RoomDialog;