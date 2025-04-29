import React, { useRef, useState } from "react";
import ChooseCategory from "./ChooseCategoryDialog/ChooseCategory";
import RoomDialog from "../../Rooms/RoomDialog/RoomDialog";

const CreateRoom = () => {
    const dialogModel = useRef(null);
    const categoryDialogRef = useRef(null);
    const roomDialogRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null); // Estado para la sala creada
    const [userId, setUserId] = useState(localStorage.getItem("id_user")); // Obtener userId de localStorage

    const openDialog = () => {
        dialogModel.current?.showModal();
    };

    const openCategoryDialog = () => {
        categoryDialogRef.current?.showModal();
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        categoryDialogRef.current?.closeModal();
    };

    const createRoom = async (roomData) => {
        try {
            const response = await fetch(`https://railwayserver-production-7692.up.railway.app/room/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_cat: selectedCategory.id_cat,
                    nameRoom: roomData.name,
                    passRoom: roomData.password,
                    id_user: userId,
                }),
            });

            const roomId = await response.json();
            if (response.ok) {
                console.log("Room created successfully:", roomId);
                setSelectedRoom({ id_room: roomId, name_room: roomData.name, id_cat: selectedCategory.id_cat }); // Guardar la sala creada
                dialogModel.current?.close(); // Cerrar el diálogo de creación
                roomDialogRef.current?.showModal(); // Abrir el diálogo de RoomDialog
            } else {
                console.error("Error creating room:", roomId);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    return (
        <div>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    openDialog();
                }}
                className="text-red-500 border border-red-600 hover:bg-red-500 hover:text-white text-xs md:block px-3 py-2 rounded-md transition cursor-pointer"
            >
                CREAR SALA
            </a>

            {/* Main Dialog */}
            <dialog
                ref={dialogModel}
                id="create-room-dialog"
                className="w-2xl dialog bg-black border-1 border-cyan-400 p-4 rounded shadow-lg text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
                <h2 className="text-white text-lg mb-4">Create a Room</h2>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const roomData = {
                            name: formData.get("roomName"),
                            password: formData.get("roomPassword"),
                        };
                        createRoom(roomData);
                    }}
                >
                    <input
                        type="text"
                        name="roomName"
                        placeholder="Room Name"
                        className="p-2 rounded bg-gray-800 text-white border border-gray-600"
                        required
                    />
                    <input
                        type="password"
                        name="roomPassword"
                        placeholder="Password (optional)"
                        className="p-2 rounded bg-gray-800 text-white border border-gray-600"
                    />
                    <button
                        type="button"
                        onClick={openCategoryDialog}
                        className="p-2 rounded bg-gray-800 text-black font-bold text border border-gray-600 flex items-center justify-center"
                        style={{
                            backgroundImage: selectedCategory
                                ? `url(${selectedCategory.img_cat})`
                                : "none",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            height: "10vh",
                            width: "100%",
                            fontSize: "1.2rem",
                        }}
                    >
                        {selectedCategory ? selectedCategory.name_cat : "Select Category"}
                    </button>

                    <div className="flex flex-col md:flex-row md:justify-between gap-2">
                        <button
                            type="submit"
                            className="w-1/2 px-4 py-2 bg-cyan-400 text-white rounded hover:bg-gray-300"
                        >
                            Create Room
                        </button>
                        <button
                            type="button"
                            onClick={() => dialogModel.current?.close()}
                            className="w-1/2 px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </dialog>

            {/* Category Selection Dialog */}
            <ChooseCategory
                ref={categoryDialogRef}
                onCategorySelect={handleCategorySelect}
                onClose={() => categoryDialogRef.current?.closeModal()}
            />

            {/* Room Dialog */}
            <RoomDialog
                dialogRef={roomDialogRef}
                selectedRoom={selectedRoom}
                currentUserId={userId}
            />
        </div>
    );
};

export default CreateRoom;