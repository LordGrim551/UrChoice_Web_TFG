import React, { useRef, useEffect, useState } from 'react';
import { MailWarning } from 'lucide-react';
import './showrequest.css';

const MailBar = () => {
    const mailDialogRef = useRef(null);
    const [id_user, setIdUser] = useState('');
    const [pendingRequests, setPendingRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem('id_user');
        if (userId) setIdUser(userId);
    }, []);

    // ...


    useEffect(() => {
        const fetchPendingRequests = async () => {
            if (!id_user) return;

            try {
                setIsLoading(true);
                const response = await fetch(`https://railwayserver-production-7692.up.railway.app/friends/request/${id_user}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener las solicitudes pendientes');
                }

                const data = await response.json();
                setPendingRequests(data);
            } catch (error) {
                console.error('Error al obtener solicitudes pendientes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingRequests();
        const interval = setInterval(fetchPendingRequests, 10000);
        return () => clearInterval(interval);
    }, [id_user]);

    // 🔥 FUNCION FUERA del useEffect
    const handleResponse = async (friendId, action) => {
        try {
            const nuevoEstado = action === 'accept' ? 'Aceptada' : 'Denegado';
            const response = await fetch(`https://railwayserver-production-7692.up.railway.app/friends/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_us1: id_user,
                    id_us2: friendId,
                    nuevoEstado,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error al ${action === 'accept' ? 'aceptar' : 'rechazar'} la solicitud`);
            }

            // 🔄 Eliminar solicitud procesada del estado
            setPendingRequests(prev => prev.filter(request => request.id_user !== friendId));
        } catch (error) {
            console.error(`Error al ${action === 'accept' ? 'aceptar' : 'rechazar'} la solicitud:`, error);
        }
    };


    const openMailDialog = () => {
        if (mailDialogRef.current) {
            mailDialogRef.current.showModal();
        }
    };



    return (
        <div className="icons block">
            <div className="mailwarning mr-6.5 cursor-pointer" onClick={openMailDialog}>
                <MailWarning />

            </div>

            <dialog
                closedby="any"
                ref={mailDialogRef}
                className="dialog bg-black border-1 border-cyan-400 p-4 rounded text-black top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >


                <div className="prueba w-full h-full mt-3.5 bg-cover bg-center flex flex-col gap-4 p-8 max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <p className="text-white">Cargando...</p>
                    ) : pendingRequests.length === 0 ? (
                        <p className="text-white">No tienes solicitudes pendientes</p>
                    ) : (
                        pendingRequests.map(user => (
                            <div key={user.id_user} className="flex flex-col sm:flex-row items-center sm:justify-between p-3 border border-cyan-400 rounded-lg">
                                {/* Imagen del usuario */}
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                    {user.img_user ? (
                                        <img
                                            src={`data:image/jpeg;base64,${user.img_user}`}
                                            alt="Foto de perfil"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-gray-500 text-xs">Sin imagen</div>
                                    )}
                                </div>

                                {/* Información del usuario */}
                                <div className="flex flex-col items-center sm:items-start flex-grow px-4 mt-2 sm:mt-0">
                                    <p className="text-xs sm:text-sm font-bold text-white truncate">{user.nick_user}</p>
                                    <p className="text-xs sm:text-sm text-gray-300 truncate">{user.email_user}</p>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex gap-2 mt-2 sm:mt-0">
                                    <button
                                        className="px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                        onClick={() => handleResponse(user.id_user, 'accept')}
                                    >
                                        Aceptar
                                    </button>
                                    <button
                                        className="px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => handleResponse(user.id_user, 'reject')}
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <form method="dialog">
                    <button className="mt-2 px-3 py-1 bg-white text-black rounded">Cerrar</button>
                </form>
            </dialog>
        </div>
    );
};

export default MailBar;