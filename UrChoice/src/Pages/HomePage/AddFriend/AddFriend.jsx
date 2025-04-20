import React, { useEffect, useRef, useState } from 'react';
import { UserPlus, MailWarning } from 'lucide-react';

const AddFriend = () => {
    const dialogRef = useRef(null);
    const mailDialogRef = useRef(null); // Nueva referencia para MailWarning


    const openDialog = () => dialogRef.current?.showModal();
    const openMailDialog = () => mailDialogRef.current?.showModal();

    return (

        <div className="icons ">


            <div className="userplus mr-6.5 cursor-pointer" onClick={openDialog}>
                <UserPlus />
            </div>

            <dialog
                ref={dialogRef}
                closedby="any"
                className="dialog bg-cyan-400 p-4 rounded shadow-lg text-black fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
                <p>Aquí puedes agregar nuevos amigos 👥</p>
                <form method="dialog">
                    <button className="mt-2 px-3 py-1 bg-white text-black rounded">Cerrar</button>
                </form>
            </dialog>

        </div>


    );
};

export default AddFriend;
