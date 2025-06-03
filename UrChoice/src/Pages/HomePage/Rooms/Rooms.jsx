import React, { useRef, useState, useEffect } from 'react';
import { User } from 'lucide-react';
import PasswordDialog from './PasswordDialog/Password';
import RoomDialog from './RoomDialog/RoomDialog';
const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [id_user, setIdUser] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null); // Estado para la sala seleccionada

    const roomDialogRef = useRef(null);
    const passwordDialogRef = useRef(null);

    const joinRoom = async (room) => {
        try {
            const response = await fetch('https://railwayserver-production-7692.up.railway.app/room/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_room: room.id_room,
                    id_user: id_user, // Usuario actual
                    password: "", // Contraseña vacía para salas sin contraseña
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Unido a la sala:', data.message);
                roomDialogRef.current?.showModal(); // Abrir RoomDialog
            } else {
                console.error('Error al unirse a la sala:', data.error);
                alert(data.error); // Mostrar error al usuario
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
        }
    };

    const openDialog = (room) => {
        setSelectedRoom(room); // Guardar la sala seleccionada
        if (room.pass_room === "") {
            // Si no hay contraseña, unirse directamente
            setRooms([]);

            joinRoom(room);
        } else {
            // Si hay contraseña, abrir PasswordDialog
            setRooms([]);

            passwordDialogRef.current?.showModal();
        }
    };

    const closeDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
            setValidationStatus(null); // Reiniciar el estado al cerrar el diálogo
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('id_user');
        if (userId) setIdUser(userId);
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`https://railwayserver-production-7692.up.railway.app/rooms/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
            console.log('Datos recibidos:', data);

            if (response.ok && Array.isArray(data)) {
                const formattedRooms = data.map(rooms => ({
                    id_room: rooms.id_room,
                    pass_room: rooms.pass_room,
                    status_room: rooms.status_room,
                    id_cat: rooms.id_cat,
                    name_room: rooms.name_room,
                    userCount: rooms.userCount,
                    img_cat: `data:image/png;base64,${rooms.img_cat}`,
                }));

                setRooms(formattedRooms);
            }
        } catch (error) {
            console.error('Error al obtener las categorias:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        const interval = setInterval(fetchCategories, 1000); // opcional: refrescar cada 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full rooms-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto scrollbar-custom p-4">
            {rooms.map((room) => (
                <div
                    key={room.id_room}
                    className="room-card border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    {/* Header */}
                    <div className="room-header bg-cyan-500 text-white rounded-t-lg p-2 text-center font-bold">
                        {room.name_room}
                    </div>

                    {/* Body */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                        <img
                            src={room.img_cat}
                            alt={room.name_room}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Footer */}
                    <div className="room-footer flex items-center justify-between bg-red-500 text-white rounded-b-lg p-2">
                        {/* Players */}
                        <div className="players flex items-center gap-2">
                            <User className="w-5 h-5 text-white" /> {/* Icono alineado */}
                            <span className="text-sm font-medium">{room.userCount} jugadores</span> {/* Texto alineado */}
                        </div>

                        {/* Botón para abrir el diálogo */}
                        <button
                            onClick={() => openDialog(room)}
                            className="px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors duration-300"
                        >
                            Unirse
                        </button>
                    </div>
                </div>
            ))}

            {/* Dialog para contraseña */}
            <PasswordDialog dialogRef={passwordDialogRef} selectedRoom={selectedRoom} roomDialogRef={roomDialogRef} />

            {/* Dialog para la sala */}
            <RoomDialog dialogRef={roomDialogRef} selectedRoom={selectedRoom} />
        </div>
    );
};

export default Rooms;