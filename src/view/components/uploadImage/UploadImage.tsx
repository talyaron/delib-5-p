import React, { FC, useState } from "react";
import styles from "./UploadImage.module.scss";
import { Statement } from "delib-npm";
import { uploadImageToStorage } from "../../../functions/db/images/setImages";
import { updateStatmentMainImage } from "../../../functions/db/statements/setStatments";

interface Props {
    statement: Statement | undefined;
}

const UploadImage: FC<Props> = ({ statement }) => {
    try {
        if (!statement) throw new Error("statement is undefined");

        const [image, setImage] = useState<File | null>(null);
        const [percentage, setPercetage] = useState(0);

        const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            setImage(file);
            const imageURL = await uploadImageToStorage(
                file,
                statement,
                setPercetage
            );
            updateStatmentMainImage(statement, imageURL);
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
                            backgroundImage: `url(${URL.createObjectURL(
                                image
                            )})`,
                        }}
                        className={styles.imagePreview}
                    />
                ) : (
                    <p>Drag and drop an image here</p>
                )}
                {percentage > 0 && <progress value={percentage} max="100" />}
            </div>
        );
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default UploadImage;
