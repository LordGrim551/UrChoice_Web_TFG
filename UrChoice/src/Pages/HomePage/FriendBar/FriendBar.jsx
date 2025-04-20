import React, { useEffect, useState } from 'react';
// import './FriendBar.css';

const FriendBar = () => {
    const [friends, setFriends] = useState([]);
    const [id_user, setIdUser] = useState('');

    // Obtener el ID del usuario desde localStorage
    useEffect(() => {
        const userId = localStorage.getItem('id_user');
        console.log('📦 ID del usuario desde localStorage:', userId);

        if (userId) {
            setIdUser(userId);
        } else {
            console.warn('⚠️ No se encontró el id_user en localStorage');
        }
    }, []);

    // Llamar a la API para obtener los amigos
    useEffect(() => {
        if (!id_user) return;
    
        const fetchFriends = async () => {
            try {
                const response = await fetch(`https://railwayserver-production-7692.up.railway.app/friends/${id_user}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
    
                const data = await response.json();
    
                if (response.ok && Array.isArray(data)) {
                    const formattedFriends = data.map(friend => ({
                        id: friend.id_user,
                        name: friend.nick_user,
                        profilePic: `data:image/png;base64,${friend.img_user}`,
                    }));
    
                    setFriends(formattedFriends);
                } else {
                    console.error('❌ Error en la estructura de los datos recibidos:', data);
                }
            } catch (error) {
                console.error('💥 Error en la petición fetch:', error);
            }
        };
    
        fetchFriends(); // Primera carga inmediata
    
        const interval = setInterval(fetchFriends, 10000); // Repetir cada 10 segundos
    
        return () => clearInterval(interval); // Limpiar cuando se desmonte el componente
    }, [id_user]);
    

    return (
        <div className="flex  w-full h-full bg-transparent border-1 border-red-600 p-4 rounded-lg text-white overflow-y-auto scrollbar-custom md:block">
            {friends.map((friend) => (
                <div
                    key={friend.id}
                    className="w-48 mr-48  m-4 flex items-center bg-transparent p-3 rounded-lg mb-4 shadow-md border-1 border-cyan-400 md:mr-4"
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
    );
};

export default FriendBar;
