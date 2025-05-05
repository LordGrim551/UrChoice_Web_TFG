import React, { useEffect, useState, useRef } from 'react';
import { UserRoundPen, CircleCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const Perfil = () => {
    const [nick, setNick] = useState('');
    const [gamesPlayed, setGamesPlayed] = useState('');
    const [profileImg, setProfileImg] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [tempNick, setTempNick] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchUserData = () => {
            const user = localStorage.getItem('user');
            if (user) {
                try {
                    const parsedUser = JSON.parse(user);
                    setProfileImg(`data:image/png;base64,${parsedUser.img_user}`);
                    setNick(parsedUser.nick_user);
                    setGamesPlayed(parsedUser.GamesPlayed);
                } catch (error) {
                    console.error('Error al parsear el usuario:', error);
                }
            }
        };

        fetchUserData();
        const interval = setInterval(fetchUserData, 5000);
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
                    user_id: parsedUser.id_user, // Asegúrate que este campo coincide con tu BD
                    nick_user: tempNick
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al actualizar el nombre');
            }

            // Actualización exitosa
            setNick(tempNick);
            setIsEditing(false);

            // Actualizar localStorage
            const updatedUser = {
                ...parsedUser,
                nick_user: tempNick
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            toast.success('Nombre actualizado correctamente');
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Error al actualizar el nombre');
            setTempNick(nick); // Revertir cambios
        }
    };

    return (
        <div className="PADRE relative w-full h-[calc(86vh-48px)] flex-grow p-4 border-[5px] border-red-600 rounded-lg overflow-hidden">
            {/* Fondo con opacidad */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
                style={{ backgroundImage: `url(${profileImg || 'Logo'})` }}
            ></div>

            {/* Contenido principal */}
            <div className="relative z-10 h-full flex flex-col items-center justify-start">
                <div className="flex flex-col items-center mb-8 w-48">
                    {/* Imagen de perfil */}
                    <div className="relative z-20 -top-4 -mb-68 w-full">
                        <div className="w-full h-84 rounded-b-full border-4 shadow-lg overflow-hidden">
                            {profileImg ? (
                                <img src={profileImg} alt="Perfil" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-gray-500 text-xl">{nick?.charAt(0) || 'U'}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex relative top-32 items-center justify-center w-full px-2">
                            {isEditing ? (
                                <div className="flex items-center w-full justify-center">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={tempNick}
                                        onChange={(e) => setTempNick(e.target.value)}
                                        className="text-white font-bold text-center bg-transparent border-b border-white focus:outline-none w-full max-w-[calc(100%-48px)]"
                                        style={{ border: '1px solid transparent' }}
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
                                    <span className="text-white font-bold text-center px-2 py-1 bg-opacity-30 rounded truncate max-w-[calc(100%-12px)]">
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

                    {/* Bandera con nombre de usuario */}
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
            </div>
        </div>
    );
};

export default Perfil;