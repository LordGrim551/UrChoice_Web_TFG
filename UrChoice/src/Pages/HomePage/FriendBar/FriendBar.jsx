import React, { useEffect, useRef, useState } from 'react';

import ShowRequest from '../ShowRequest/ShowRequest';
import AddFriend from '../AddFriend/AddFriend';
import './FriendBar.css'; // Asegúrate de importar el CSS para el scrollbar personalizado
const FriendBar = () => {
    const [friends, setFriends] = useState([]);
    const [id_user, setIdUser] = useState('');


    useEffect(() => {
        const userId = localStorage.getItem('id_user');
        if (userId) setIdUser(userId);
    }, []);

    useEffect(() => {
        if (!id_user) return;

        const fetchFriends = async () => {
            try {
                const response = await fetch(`https://railwayserver-production-7692.up.railway.app/friends/${id_user}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();

                if (response.ok && Array.isArray(data)) {
                    const formattedFriends = data.map(friend => ({
                        id: friend.id_user,
                        name: friend.nick_user,
                        profilePic: `data:image/png;base64,${friend.img_user}`,
                    }));
                    setFriends(formattedFriends);
                }
            } catch (error) {
                console.error('Error al obtener amigos:', error);
            }
        };

        fetchFriends();
        const interval = setInterval(fetchFriends, 10000);
        return () => clearInterval(interval);
    }, [id_user]);



    return (
        <div className="flex flex-col w-full h-full bg-transparent border-1 border-red-600 p-4 rounded-lg text-white overflow-y-auto scrollbar-custom">

            <div className="friends flex justify-between items-center mb-5">

                {/* Contenedor de íconos en la parte superior */}
                <span className="amigos text-m font-bold mr-8">AMIGOS</span>
                <div className="icons flex justify-end items-center ">

                    <AddFriend />
                    <ShowRequest />
                </div>

            </div>

            {/* Contenedor de las cartas de amigos en una fila horizontal */}
            <div className="flex overflow-x-auto gap-4 scrollbar-custom md:block ">
                {friends.map((friend) => (
                    <div
                        key={friend.id}
                        className="CARTA flex-shrink-0 w-48 mb-4 flex items-center bg-transparent p-3 rounded-lg shadow-md border border-cyan-400 md:w-full"
                    >
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
                            <img
                                src={friend.profilePic}
                                alt={`${friend.name}'s profile`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="ml-4">
                            <div className="text-xs font-semibold">{friend.name}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendBar;
