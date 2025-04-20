import React, { useRef } from 'react';
import { MailWarning } from 'lucide-react';

const MailBar = () => {
    const mailDialogRef = useRef(null);

    const openMailDialog = () => mailDialogRef.current?.showModal();

    return (
        <div className="icons ">

            {/* Icono para abrir el modal */}
            <div className="mailwarning mr-6.5 cursor-pointer" onClick={openMailDialog}>
                <MailWarning />
            </div>

            {/* Modal que se abre al hacer clic en el ícono */}
            <dialog
                ref={mailDialogRef}
                className="dialog bg-yellow-300 p-4 rounded shadow-lg text-black fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
                <p>¡Tienes nuevas notificaciones! 📬</p>
                <form method="dialog">
                    <button className="mt-2 px-3 py-1 bg-white text-black rounded">Cerrar</button>
                </form>
            </dialog>
        </div>

    );
};

export default MailBar;
