import React, { useEffect, useRef, useState } from 'react';
import { UserPlus, MailWarning } from 'lucide-react';

const AddFriend = () => {
    const dialogRef = useRef(null);
    const mailDialogRef = useRef(null); // Nueva referencia para MailWarning


    const openDialog = () => dialogRef.current?.showModal();
    const openMailDialog = () => mailDialogRef.current?.showModal();

    return (

        <div className="icons ">


            <div className="userplus mr-6.5 cursor-pointer " onClick={openDialog}>
                <UserPlus />
            </div>

            <dialog
                ref={dialogRef}
                closedby="any"
                className="w-2xl dialog bg-black border-1 border-cyan-400 p-4 rounded shadow-lg text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
    
                {/* -------------SEARCHBAR--------------- */}
                <form class="flex items-center max-w-sm mx-auto mt-5">
                    <label for="simple-search" class="sr-only">Search</label>
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
                            </svg>
                        </div>
                        <input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search branch name..." required />
                    </div>
                    <button type="submit" class="p-2.5 ms-2 text-sm font-medium text-white bg-cyan-400 rounded-lg border border-blue-700 hover:bg-cyan-400 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-cyan-400 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                        <span class="sr-only">Search</span>
                    </button>
                </form>
                {/* ------------------------------ */}
                <form method="dialog">
                    <button className="mt-8 mb-8 px-3 py-1 bg-black border-1 border-cyan-400 text-white rounded">Cerrar</button>
                </form>
            </dialog>

        </div>


    );
};

export default AddFriend;
