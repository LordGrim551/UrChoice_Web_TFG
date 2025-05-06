import React, { useEffect, useState, useRef } from 'react';
import { UserRoundPen, CircleCheck, EditIcon } from 'lucide-react';
import { toast } from 'react-toastify';

const Perfil = () => {
    const [nick, setNick] = useState('');
    const [gamesPlayed, setGamesPlayed] = useState('');
    const [profileImg, setProfileImg] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [tempNick, setTempNick] = useState('');
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const [numberFriends, setNumbreFriends] = useState('');

    useEffect(() => {
        const fetchUserData = () => {
            const user = localStorage.getItem('user');
            if (user) {
                try {
                    const parsedUser = JSON.parse(user);
                    if (parsedUser.img_user) {
                        setProfileImg(
                            parsedUser.img_user.startsWith('data:image')
                                ? parsedUser.img_user
                                : `data:image/png;base64,${parsedUser.img_user}`
                        );
                    }
                    setNick(parsedUser.nick_user || '');
                    setGamesPlayed(parsedUser.GamesPlayed || 'Vamos juega que estas esperando');
                } catch (error) {
                    console.error('Error al parsear el usuario:', error);
                }
            }
        };

        fetchUserData();
        const interval = setInterval(fetchUserData, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchFriendsData = async () => {
            const user = localStorage.getItem('user');
            if (user) {
                try {
                    const parsedUser = JSON.parse(user);
                    const response = await fetch(`https://railwayserver-production-7692.up.railway.app/friends/count/${parsedUser.id_user}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });

                    const data = await response.json();
                    if (data.count === 0 || !data) {
                        setNumbreFriends('UwU no tienes amigos');
                        // setNumbreFriends({ count: 0 });
                    } else {

                        setNumbreFriends(data.count.toString());
                    }

                    // setGamesPlayed(parsedUser.GamesPlayed || '');
                } catch (error) {
                    console.error('Error al parsear el usuario:', error);
                }
            }
        };

        fetchFriendsData();
        const interval = setInterval(fetchFriendsData, 5000);
        return () => clearInterval(interval);
    }, []);



    const handleEditClick = () => {
        setTempNick(nick);
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleSaveClick = async () => {
        if (!tempNick.trim()) {
            toast.error('El nombre de usuario no puede estar vacío');
            return;
        }

        const user = localStorage.getItem('user');
        if (!user) {
            toast.error('No se encontró información del usuario');
            return;
        }

        try {
            const parsedUser = JSON.parse(user);
            const response = await fetch(`https://railwayserver-production-7692.up.railway.app/user/UpdateName`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: parsedUser.id_user,
                    nick_user: tempNick
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al actualizar el nombre');
            }

            setNick(tempNick);
            setIsEditing(false);

            const updatedUser = {
                ...parsedUser,
                nick_user: tempNick
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            toast.success('Nombre actualizado correctamente');
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Error al actualizar el nombre');
            setTempNick(nick);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.warning("Por favor, sube un archivo de imagen válido");
            return;
        }

        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            toast.warning("La imagen no debe superar los 2MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;

            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    toast.error('No se encontró información del usuario');
                    return;
                }

                const response = await fetch(`https://railwayserver-production-7692.up.railway.app/user/UpdateIMG`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: user.id_user,
                        img_user: base64String.split(',')[1]
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Error al actualizar la imagen');
                }

                setProfileImg(base64String);

                const updatedUser = {
                    ...user,
                    img_user: base64String.split(',')[1]
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                toast.success('Imagen de perfil actualizada correctamente');
            } catch (error) {
                console.error('Error:', error);
                toast.error(error.message || 'Error al actualizar la imagen');
            }
        };
        reader.readAsDataURL(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="PADRE relative w-full h-[calc(75vh-48px)] flex-grow p-4 border-[5px] border-red-600 rounded-lg overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
                style={{
                    backgroundImage: `url(${profileImg || '/default-background.jpg'})`,
                    backgroundColor: !profileImg ? '#cccccc' : 'transparent'
                }}
            ></div>

            <div className="relative z-10 h-full flex flex-col items-center justify-start">
                <div className="flex flex-col items-center mb-8 w-36">
                    <div className="relative z-20 -top-4 -mb-96 w-full">
                        <div
                            className="w-full h-54 rounded-b-full border-4 shadow-lg overflow-hidden cursor-pointer"
                            onClick={triggerFileInput}
                        >
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                {profileImg ? (
                                    <img
                                        src={profileImg}
                                        alt="Perfil"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-500 text-4xl font-bold">
                                        {nick?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                )}
                                <div className="absolute bottom-2 right-2 bg-opacity-50 p-1 rounded-full">
                                    <EditIcon className="text-white" size={20} />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>

                        <div className="flex relative top-12 items-center justify-center w-full px-2">
                            {isEditing ? (
                                <div className="flex items-center w-full justify-center">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={tempNick}
                                        onChange={(e) => setTempNick(e.target.value)}
                                        className="text-white font-bold text-center bg-transparent border-b border-white focus:outline-none w-full max-w-[calc(100%-48px)]"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveClick()}
                                    />
                                    <CircleCheck
                                        className="text-white cursor-pointer ml-1"
                                        size={20}
                                        onClick={handleSaveClick}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <span className="text-white font-bold text-center text-xs px-2 py-1 bg-opacity-30 rounded truncate max-w-[calc(100%-12px)]">
                                        {nick || "Usuario"}
                                    </span>
                                    <UserRoundPen
                                        className="text-white cursor-pointer ml-1"
                                        size={20}
                                        onClick={handleEditClick}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative z-10 w-full h-120 flex flex-col items-center">
                        <div className="Rectangulo border-4 w-full h-[100%] rounded-b-full flex items-end justify-center pb-4"
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(5px)',
                                border: '4px solid rgba(255, 255, 255, 0.8)',
                                borderTop: 'none',
                            }}>
                        </div>
                    </div>

                </div>
                {/* SECCIÓN FUERA DEL RECTÁNGULO - GAMES PLAYED */}
                <div className="w-full flex justify-around mt-4">
                    {/* Primer dato gamesPlayed */}
                    <div className="text-center">
                        <p className="text-white text-xl">{gamesPlayed}</p>
                        <p className="text-white font-bold text-2xl">GAMES PLAYED</p>
                    </div>

                    {/* Segundo dato gamesPlayed */}
                    <div className="text-center">
                        <p className="text-white  text-xl">{numberFriends}</p>
                        <p className="text-white font-bold text-2xl">AMIGOS</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;