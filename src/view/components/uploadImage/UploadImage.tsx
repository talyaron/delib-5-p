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

	const [image, setImage] = useState<File | null>(null);
	const [percentage, setPercentage] = useState(0);

	const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
		try {
			if (!statement) throw new Error("statement is undefined");
			event.preventDefault();
			const file = event.dataTransfer.files[0];
			const compressedFile = await compressImage(file, 200);
			setImage(compressedFile);
			const imageURL = await uploadImageToStorage(
				compressedFile,
				statement,
				setPercentage
			);
			updateStatementMainImage(statement, imageURL);
		} catch (error) {
			console.error(error);
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const compressImage = (file: File, maxSizeKB: number): Promise<File> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (event) => {
				const img = new Image();
				img.src = event.target?.result as string;
				img.onload = () => {
					const canvas = document.createElement("canvas");
					const ctx = canvas.getContext("2d");
					if (!ctx) {
						return reject(new Error("Could not get canvas context"));
					}
					let width = img.width;
					let height = img.height;
					const MAX_TRIES = 10;
					let quality = 0.8;
					let tries = 0;

					const resize = () => {
						canvas.width = width;
						canvas.height = height;
						ctx.drawImage(img, 0, 0, width, height);
						canvas.toBlob(
							(blob) => {
								if (blob && blob.size / 1024 <= maxSizeKB) {
									resolve(new File([blob], file.name, { type: file.type }));
								} else if (tries < MAX_TRIES) {
									quality -= 0.1;
									width *= 0.9;
									height *= 0.9;
									tries++;
									resize();
								} else {
									reject(new Error("Unable to compress image below max size"));
								}
							},
							file.type,
							quality
						);
					};
					resize();
				};
			};
			reader.onerror = (error) => reject(error);
		});
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
						backgroundImage: `url(${URL.createObjectURL(image)})`,
					}}
					className={styles.imagePreview}
				/>
			)}
			{!image && <p>Drag and drop an image here</p>}
			{percentage > 0 && <progress value={percentage} max="100" />}
		</div>
	);
};

export default UploadImage;
