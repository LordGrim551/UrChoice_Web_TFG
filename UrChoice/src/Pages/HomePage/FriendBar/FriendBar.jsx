import React, { useEffect, useRef, useState } from 'react';
import { UserPlus, MailWarning } from 'lucide-react';
import ShowRequest from '../ShowRequest/ShowRequest';
import AddFriend from '../AddFriend/AddFriend';
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
        <div className="flex w-full h-full bg-transparent border-1 border-red-600 p-4 rounded-lg text-white overflow-y-auto scrollbar-custom md:block">
            {/* <div className="icons flex  ">
                <span className='amigos font-bold w-full'>AMIGOS</span>
                <AddFriend/>
                <ShowRequest/>

            </div> */}

            {friends.map((friend) => (
             <div
             key={friend.id}
             className="mr-4 m-4 flex items-center bg-transparent p-3 rounded-lg mb-4 shadow-md border-1 border-cyan-400 md:mr-4 w-48 max-h-16 min-h-16 overflow-hidden"
         >
             <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
                 <img
                     src={friend.profilePic}
                     alt={`${friend.name}'s profile`}
                     className="w-full h-full object-cover"
                 />
             </div>
             <div className="ml-4">
                 <div className="text-xs font-semibold ">{friend.name}</div>
             </div>
         </div>
            ))}
        </div>
    );
};

export default FriendBar;
