import React, { FC, useState } from "react";
import "./UploadImage.scss";
import { Statement } from "delib-npm";
import { handleFileUpload } from "./uploadImageCont";

interface Props {
	statement: Statement;
}

const UploadImage: FC<Props> = ({ statement }) => {
	const imageUrl = statement.imagesURL?.main ?? null;
	
	const [image, setImage] = useState<File | null>(null);

	// currently changing image is not possible, when we fix it we can remove this
	if (imageUrl) {
		return (
			<div className={"dropZone"}>
				<div
					style={{ backgroundImage: `url(${imageUrl})` }}
					className={"imagePreview"}
				/>
			</div>
		);
	}

	const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
		try {
			if (!statement) throw new Error('statement is undefined');
	
			event.preventDefault();

			const file = event.dataTransfer.files[0];

			handleFileUpload(file, statement, setImage);

		} catch (error) {
			console.error(error);
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.currentTarget.classList.add("dropZoneActive")
	}
	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.currentTarget.classList.remove("dropZoneActive")
	}

	return (
		<div
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			className={"dropZone"}
		>
			{imageUrl && !image && (
				<div
					style={{ backgroundImage: `url(${imageUrl})` }}
					className={"imagePreview"}
				/>
			)}
			{image && (
				<div
					style={{
						backgroundImage: `url(${URL.createObjectURL(image)})`,
					}}
					className={"imagePreview"}
				/>
			)}
			{!image && <p>Drag and drop an image here</p>}
		</div>
	);
};

export default UploadImage;
