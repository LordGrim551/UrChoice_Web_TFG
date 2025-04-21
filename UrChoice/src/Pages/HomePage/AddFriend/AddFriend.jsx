import React, { useRef, useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';

const AddFriend = () => {
    const dialogRef = useRef(null);
    const [id_user, setIdUser] = useState('');
    const [nick_name, setNickName] = useState('');
    const [status, setStatus] = useState(null);

    // Función para abrir el diálogo y resetear el estado
    const openDialog = () => {

        // Resetear el estado cada vez que se abre el diálogo
        setNickName('');  // Reiniciar el valor de nick_name
        setStatus(null);  // Limpiar el mensaje de status
        dialogRef.current?.showModal();
    };

    useEffect(() => {
        const userId = localStorage.getItem('id_user');
        if (userId) setIdUser(userId);
    }, []);

    const sendFriendRequest = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://railwayserver-production-7692.up.railway.app/friends', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_us1: id_user,
                    nick_name: nick_name,
                }),
            });

            const data = await response.json();
            console.table(data);

            if (response.status === 201) {
                setStatus({ estado: 'enviada', message: 'Solicitud de amistad enviada exitosamente.' });
            } else if (response.status === 400) {
                // Aquí puedes inspeccionar `data.error` si quieres diferenciar "pendiente" de "aceptada" con más precisión
         
                    setStatus({ estado: 'amigos', message: 'Enviado u recibido la solicitud de amistad o puede que ya sean amigos UwU' });
              
            } else if (response.status === 404) {
                setStatus({ estado: 'error', message: 'Usuario no encontrado.' });
            } else {
                setStatus({ estado: 'error', message: `Error inesperado. Código: ${response.status}` });
            }
        } catch (error) {
            setStatus({ estado: 'error', message: 'Hubo un error al conectarse al servidor.' });
            console.error('Error de conexión', error);
        }
    };


    return (
        <div className="icons">
            <div className="userplus mr-6.5 cursor-pointer" onClick={openDialog}>
                <UserPlus />
            </div>

            <dialog
                ref={dialogRef}
                className="w-2xl dialog bg-black border-1 border-cyan-400 p-4 rounded shadow-lg text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
                <form onSubmit={sendFriendRequest} className="flex items-center max-w-sm mx-auto mt-5">
                    <label htmlFor="simple-search" className="sr-only">Search</label>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 18 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="nick_name"
                            name="nick_name"
                            value={nick_name}
                            onChange={(e) => setNickName(e.target.value)}
                            required
                            placeholder="Introduzca el nombre del usuario..."
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-cyan-400 rounded-lg border border-blue-700 hover:bg-cyan-400 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-cyan-400 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </form>

                {/* STATUS MESSAGE */}
                {status && (
                    <div className={`mt-6 p-3 text-white rounded
                    ${status.estado === 'enviada' ? 'bg-green-500' : ''}
                    ${status.estado === 'amigos' ? 'bg-cyan-500' : ''}
                    ${status.estado === 'error' ? 'bg-red-600' : ''}
                `}>
                        {status.message}
                    </div>
                )}




                {/* CERRAR */}
                <form method="dialog">
                    <button className="mt-8 mb-8 px-3 py-1 bg-black border-1 border-cyan-400 text-white rounded">Cerrar</button>
                </form>
            </dialog>
        </div>
    );
};

export default AddFriend;
