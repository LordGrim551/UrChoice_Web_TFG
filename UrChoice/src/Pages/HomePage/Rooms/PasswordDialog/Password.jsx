import React, { useState } from 'react';

const PasswordDialog = ({ dialogRef, selectedRoom, roomDialogRef }) => {
    const [validationStatus, setValidationStatus] = useState(null); // Estado para manejar la validación
    const [id_user] = useState(localStorage.getItem('id_user')); // Obtener el ID del usuario desde localStorage

    const closeDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
            setValidationStatus(null); // Reiniciar el estado al cerrar el diálogo
        }
    };

    const JoinRoom = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://railwayserver-production-7692.up.railway.app/room/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_user: id_user,
                    id_room: selectedRoom.id_room,
                    password: e.target.password.value, // Obtener la contraseña del formulario
                }),
            });

            if (response.ok) {
                setValidationStatus({ estado: 'success', message: '¡Contraseña correcta! Uniendo a la sala...' });
                setTimeout(() => {
                    closeDialog(); // Cerrar el PasswordDialog
                    roomDialogRef.current?.showModal(); // Abrir el RoomDialog
                }, 1000);
            } else {
                setValidationStatus({ estado: 'error', message: 'Contraseña incorrecta. Inténtelo de nuevo.' });
            }
        } catch (error) {
            console.error('Error al unirse a la sala:', error);
            setValidationStatus({ estado: 'error', message: 'Hubo un error al conectarse al servidor.' });
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className="w-2xl dialog bg-black border border-cyan-500 rounded-3xl p-4 shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
            <h2 className="text-lg font-bold mb-4 text-white">
                Unirse a la sala {selectedRoom?.name_room}
            </h2>
            <form onSubmit={JoinRoom}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                    Introduzca la contraseña:
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full p-2 border border-cyan-400 rounded mb-4"
                    required
                />
                {/* STATUS MESSAGE */}
                {validationStatus && (
                    <div
                        className={`mt-6 mb-6 p-3 text-white rounded ${
                            validationStatus.estado === 'success' ? 'bg-green-500' : 'bg-red-600'
                        }`}
                    >
                        {validationStatus.message}
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={closeDialog}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                    >
                        Unirse
                    </button>
                </div>
            </form>
        </dialog>
    );
};

export default PasswordDialog;