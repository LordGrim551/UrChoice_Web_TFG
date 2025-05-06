import React from 'react';
import './profile.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './logoHeader.png';
import { LogOut } from 'lucide-react';

const Profile = () => {
    const [nick, setNick] = useState('');
    const [gamesPlayed, setGamesPlayed] = useState('');
    const [profileImg, setProfileImg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = () => {
            const user = localStorage.getItem('user');
    
            if (user) {
                try {
                    const parsedUser = JSON.parse(user);
                    console.log('Datos de usuario:', parsedUser);
    
                    setProfileImg(`data:image/png;base64,${parsedUser.img_user}`);
                    setNick(parsedUser.nick_user);
                    setGamesPlayed(parsedUser.GamesPlayed);
                } catch (error) {
                    console.error('Error al parsear el usuario:', error);
                }
            } else {
                console.log('No se encontró el usuario en el localStorage');
            }
        };
    
        fetchUserData(); // Llamada inicial
        const interval = setInterval(fetchUserData, 5000); // Repite cada 5 segundos
    
        return () => clearInterval(interval); // Limpia el intervalo al desmontar
    }, []);
    
    

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/Tap_to_start');
    };

    return (
        <div className="profile-header flex items-center justify-between p-4 text-white rounded-lg shadow-lg border border-cyan-500 md:border-0">

            <div className="profile-column">
                <div className="w-12 h-12 rounded-full border-4 border-amber-600 overflow-hidden mr-2">
                    <img src={profileImg || Logo} alt="Foto de perfil" className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="profile-column profile-info flex flex-row md:flex-col gap-x-4 text-justify text-xs">
                <h2 className="profile-name">{nick ? `${nick}` : 'DEFAULT'}</h2>
                <p className="profile-games">{gamesPlayed ? `${gamesPlayed}` : '0'}</p>
            </div>

            {/* Botón solo visible en móviles */}
            <div className="profile-column md:hidden">
                <button
                    onClick={handleLogout}
                    className="border border-cyan-400 text-cyan-400 px-3 py-1 rounded-md hover:bg-cyan-400 hover:text-white transition"
                >
                    Cerrar sesión
                </button>
            </div>
            <a  
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 p-2 rounded hover:bg-red-500 hover:text-white transition ml-4 ">
                <LogOut className="w-5 h-5 text-white-500" />
            </a>
        </div>
    );
};

export default Profile;
