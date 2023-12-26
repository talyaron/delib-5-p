import React, { useState } from "react";
import styles from "./UploadImage.module.scss";

const UploadImage = () => {
    const [image, setImage] = useState<File | null>(null);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setImage(file);

        
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={styles.dropZone}
        >
            {image ? (
                <div
                    style={{
                        backgroundImage: `url(${URL.createObjectURL(image)})`
                    }}
                    className={styles.imagePreview}
                />
            ) : (
                <p>Drag and drop an image here</p>
            )}
        </div>
    );
};

export default UploadImage;
