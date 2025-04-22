import React, { useState } from "react";
// import "./CreateCategory.css";

const CreateCategory = () => {
    const [backgroundImage, setBackgroundImage] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setBackgroundImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="create-category-container">
            <input
                type="text"
                placeholder="Category Name"
                className="input-field"
            />
            <div
                className="image-upload-field"
                style={{
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
                }}
            >
                <input type="file" onChange={handleImageUpload} />
            </div>
            <input
                type="text"
                placeholder="Card Name"
                className="input-field"
            />
            <div className="wide-rectangle"></div>
        </div>
    );
};

export default CreateCategory;