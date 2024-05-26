import React, { FC, useState } from "react";
import styles from "./UploadImage.module.scss";
import { Statement } from "delib-npm";
import { uploadImageToStorage } from "../../../controllers/db/images/setImages";
import { updateStatementMainImage } from "../../../controllers/db/statements/setStatements";

interface Props {
    statement: Statement;
}

const UploadImage: FC<Props> = ({ statement }) => {
	const imageUrl = statement.imagesURL?.main ?? null;

	// currently changing image is not possible, when we fix it we can remove this
	if (imageUrl) {
		return (
			<div className={styles.dropZone}>
				<div
					style={{ backgroundImage: `url(${imageUrl})` }}
					className={styles.imagePreview}
				/>
			</div>
		);
	}

	try {
		const [image, setImage] = useState<File | null>(null);
		const [percentage, setPercentage] = useState(0);

		const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
			try {
				if (!statement) throw new Error("statement is undefined");
				event.preventDefault();
				const file = event.dataTransfer.files[0];
				setImage(file);
				const imageURL = await uploadImageToStorage(
					file,
					statement,
					setPercentage,
				);
				updateStatementMainImage(statement, imageURL);
			} catch (error) {
				console.error(error);
			}
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
				{imageUrl && !image && (
					<div
						style={{ backgroundImage: `url(${imageUrl})` }}
						className={styles.imagePreview}
					/>
				)}
				{image && (
					<div
						style={{
							backgroundImage: `url(${URL.createObjectURL(
								image,
							)})`,
						}}
						className={styles.imagePreview}
					/>
				)}
				{!image && <p>Drag and drop an image here</p>}
				{percentage > 0 && <progress value={percentage} max="100" />}
			</div>
		);
	} catch (error) {
		console.error(error);

		return null;
	}
};

export default UploadImage;
