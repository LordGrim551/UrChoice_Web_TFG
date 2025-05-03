import React, { useRef, useState } from 'react';

const AddCard = ({ onAddCard }) => {
  const dialogRef = useRef(null);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  const handleAddCard = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cardName = formData.get('cardName');
    console.log('Card Name:', cardName);

    if (cardName && previewImage) {
      onAddCard({
        name: cardName,
        image: previewImage,
      });
    }
    closeDialog();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleClickImage = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <button
        onClick={openDialog}
        style={{ padding: `1rem`, fontSize: `1rem`, backgroundColor: `gray` }}
        className="w-full mt-2 mb-4 bg-gray-400 text-white rounded hover:bg-gray-300"
      >
        Add Card
      </button>

      <dialog
        ref={dialogRef}
        className="w-2xl dialog bg-black border-1 border-cyan-400 p-4 rounded shadow-lg text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <h2 className="text-white text-lg mb-4">Add New Card</h2>
        <form onSubmit={handleAddCard} className="flex flex-col gap-4">
          {/* Imagen circular editable */}
          <div className="profile-container">
            <div className="profile" onClick={handleClickImage}>
              <img
                src={previewImage || "./logo.png"}
                alt="Card Preview"
                className="foto-perfil"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

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
