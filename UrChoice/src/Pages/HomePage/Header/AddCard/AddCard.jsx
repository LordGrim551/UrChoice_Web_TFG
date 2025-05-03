import React, { useRef } from 'react';

const AddCard = () => {
  const dialogRef = useRef(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cardName = formData.get('cardName');

    // Aquí puedes agregar la lógica para enviar la información de la carta (cardName) a tu backend
    console.log('Card Name:', cardName);

    // Ejemplo de cómo cerrar el diálogo después de procesar la información
    closeDialog();
  };

  return (
    <div>
      <button
        onClick={openDialog}
        className="text-blue-500 border border-blue-600 hover:bg-blue-500 hover:text-white text-xs md:width-full block px-3 py-2 rounded-md transition cursor-pointer"
      >
        Add Card
      </button>

      <dialog
        ref={dialogRef}
        className="w-2xl dialog bg-black border-1 border-cyan-400 p-4 rounded shadow-lg text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <h2 className="text-white text-lg mb-4">Add New Card</h2>
        <form
          onSubmit={handleAddCard}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            name="cardName"
            placeholder="Card Name"
            className="p-2 rounded bg-gray-800 text-white border border-gray-600"
            required
          />
          <div className="flex flex-col md:flex-row md:justify-between gap-2">
            <button
              type="submit"
              className="w-1/2 px-4 py-2 bg-cyan-400 text-white rounded hover:bg-gray-300"
            >
              Add Card
            </button>
            <button
              type="button"
              onClick={closeDialog}
              className="w-1/2 px-4 py-2 bg-red-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default AddCard;