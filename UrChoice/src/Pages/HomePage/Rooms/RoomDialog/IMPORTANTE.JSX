import React, { useState, useEffect } from 'react';
import { Trash, Check } from 'lucide-react';

const RoomDialog = ({ dialogRef, selectedRoom, currentUserId }) => {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState(currentUserId);

    // Obtener userId del localStorage si no viene por props
    useEffect(() => {
        if (!userId) {
            const storedUserId = localStorage.getItem('id_user');
            if (storedUserId) {
                setUserId(storedUserId);
            }
        }
    }, [currentUserId, userId]);
    

    const closeDialog = () => {
        dialogRef.current?.close();
    };

    const updateVote = async () => {
        if (!userId || !selectedRoom?.id_room) {
            console.error("Falta id_user o id_room");
            return;
        }

        try {
            const response = await fetch(
                `https://railwayserver-production-7692.up.railway.app/room/updateVote`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_user: userId,
                        id_room: selectedRoom.id_room,
                        vote_game: 'LISTO',
                    }),
                }
            );

            if (response.ok) {
                console.log('Voto actualizado a LISTO');
                // Opcional: Actualizar el estado local para reflejar el cambio
                setUsers(users.map(user =>
                    user.id_user === userId
                        ? { ...user, vote_game: 'LISTO' }
                        : user
                ));
            } else {
                console.error('Error al actualizar el voto:', await response.json());
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
        }
    };

    // const handleKickUser = async (userIdToKick) => {
    //     if (!selectedRoom?.id_room || !userIdToKick) {
    //         console.error("Falta id_room o id_user para expulsar");
    //         return;
    //     }

    //     try {
    //         const response = await fetch(
    //             `https://railwayserver-production-7692.up.railway.app/room/end`,
    //             {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     id_room: selectedRoom.id_room,
    //                     id_user: userIdToKick,
    //                 }),
    //             }
    //         );

    //         if (response.ok) {
    //             console.log(`Usuario con id ${userIdToKick} expulsado correctamente`);
    //             // Actualizar la lista de usuarios localmente
    //             setUsers(users.filter(user => user.id_user !== userIdToKick));
    //         } else {
    //             console.error('Error al expulsar al usuario:', await response.json());
    //         }
    //     } catch (error) {
    //         console.error('Error al conectar con el servidor:', error);
    //     }
    // };

    const fetchUsers = async () => {
        if (!selectedRoom?.id_room) return;

        try {
            const response = await fetch(
                `https://railwayserver-production-7692.up.railway.app/room/${selectedRoom.id_room}/users`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            const data = await response.json();

            if (response.ok && Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error('Error al obtener los usuarios:', data);
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 3000);
        return () => clearInterval(interval);
    }, [selectedRoom]);
    

    const renderUserInfo = (user) => {
        if (user.admin) {
            return <span className="text-yellow-400 font-bold">Admin</span>;

        }
        // } else {
        //     return (
        //         <Trash
        //             className="w-auto h-auto text-red-600 cursor-pointer hover:text-red-800"
        //             onClick={() => handleKickUser(user.id_user)} // Llama a handleKickUser con el id_user
        //         />
        //     );
        // }
    };

    return (
        <dialog
            ref={dialogRef}
            className="w-2xl overflow-y-auto scrollbar-custom dialog bg-black border rounded-3xl border-cyan-400 p-4 shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
            <h2 className="text-lg font-bold mb-4 text-white">
                Usuarios en la sala {selectedRoom?.name_room}
            </h2>
            <div className="space-y-4 max-h-64 overflow-y-auto">
                {users.map((user) => (
                    <div
                        key={user.id_user}
                        className="flex items-center justify-between border-b border-gray-600 pb-2"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-gray-300 font-medium">
                                {user.nick_user}
                            </span>

                        </div>
                        <div className="flex gap-4 items-center">
                            {renderUserInfo(user)}
                            {user.vote_game === 'LISTO' && (
                                <>

                                    <Check className="w-auto h-auto text-green-500" />
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-4 mt-6">
                <button
                    onClick={closeDialog}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    Cerrar
                </button>
                <button
                    onClick={updateVote}
                    disabled={users.find(u => u.id_user === userId)?.vote_game === 'LISTO'}
                    className={`px-4 py-2 rounded ${users.find(u => u.id_user === userId)?.vote_game === 'LISTO'
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-cyan-500 hover:bg-cyan-600'
                        } text-white`}
                >
                    {users.find(u => u.id_user === userId)?.vote_game === 'LISTO'
                        ? 'Ya estás listo'
                        : 'Listo'
                    }
                </button>
            </div>
        </dialog>
    );
};

export default RoomDialog;