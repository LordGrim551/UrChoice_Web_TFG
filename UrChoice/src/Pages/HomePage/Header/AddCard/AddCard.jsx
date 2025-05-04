import React, { useRef, useState } from 'react';

const AddCard = ({ onAddCard }) => {
  const dialogRef = useRef(null);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [cardName, setCardName] = useState('');
  const [error, setError] = useState('');

  const openDialog = () => {
    setCardName('');
    setPreviewImage(null);
    setError('');
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleAddCard = () => {
    if (!cardName.trim()) {
      setError("El nombre de la carta es requerido");
      return;
    }

    if (!previewImage) {
      setError("Debes seleccionar una imagen");
      return;
    }

    // Extrae solo el Base64 (sin el prefijo data:image/...)
    const base64String = previewImage.split(',')[1];
    onAddCard({ 
      name: cardName.trim(), 
      image: base64String 
    });

    closeDialog();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validaciones
    if (!file.type.startsWith('image/')) {
      setError("Solo se permiten imágenes (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen no debe superar 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleClickImage = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <button
        onClick={openDialog}
        className="w-full mt-2 mb-4 bg-gray-400 text-white rounded hover:bg-gray-300 p-4"
      >
        Add Card
      </button>

      <dialog
        ref={dialogRef}
        className="w-2xl dialog bg-black border-1 border-cyan-400 p-4 rounded shadow-lg text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <h2 className="text-white text-lg mb-4">Add New Card</h2>
        <div className="flex flex-col gap-4">
          {/* Imagen editable */}
          <div className="flex justify-center">
            <div 
              className="w-32 h-32 rounded-full overflow-hidden cursor-pointer border-2 border-cyan-400"
              onClick={handleClickImage}
            >
              <img
                src={previewImage || "./logo.png"} 
                alt="Card Preview"
                className="w-full h-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
          
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Card Name"
            className="p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-2">
            <button
              onClick={handleAddCard}
              className="flex-1 px-4 py-2 bg-cyan-400 text-white rounded hover:bg-cyan-500"
            >
              Add Card
            </button>
            <button
              onClick={closeDialog}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AddCard;