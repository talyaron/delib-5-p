import React, { FC, useState } from 'react';
import './UploadImage.scss';
import { Statement } from 'delib-npm';
import { handleFileUpload } from './uploadImageCont';

interface Props {
	statement: Statement;
}

const UploadImage: FC<Props> = ({ statement }) => {
	const imageUrl = statement.imagesURL?.main ?? null;
	const [image, setImage] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [aspectRatio, setAspectRatio] = useState('1/1');
	const [progress, setProgress] = useState(0);

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		try {
			if (!statement) throw new Error('statement is undefined');

			const file = event.target.files?.[0];
			if (file) {
				handleFileUpload(file, statement, setImage, setProgress);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleDragEnter = () => setIsDragging(true);
	const handleDragLeave = () => setIsDragging(false);

	const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
		event.preventDefault();
		setIsDragging(false);

		try {
			if (!statement) throw new Error('statement is undefined');

			const file = event.dataTransfer.files[0];

			if (file) {
				const img = new Image();
				const reader = new FileReader();

				reader.onloadend = () => {
					if (reader.result) {
						img.src = reader.result as string;

						img.onload = () => {
							const width = img.naturalWidth;
							const height = img.naturalHeight;

							setAspectRatio(`${width}/${height}`);

							handleFileUpload(file, statement, setImage, setProgress);
						};
					}
				};

				reader.readAsDataURL(file);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<label
			className={`dropZone ${isDragging ? 'dropZoneActive' : ''}`}
			style={{ aspectRatio }}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={(e) => e.preventDefault()}
			onDrop={handleDrop}
		>
			<input
				type='file'
				accept='image/*'
				onChange={handleFileChange}
				className='fileInput'
			/>
			{imageUrl && !image && (
				<div
					style={{ backgroundImage: `url(${imageUrl})` }}
					className='imagePreview'
				/>
			)}
			{image && (
				<div
					style={{
						backgroundImage: `url(${URL.createObjectURL(image)})`,
					}}
					className='imagePreview'
				/>
			)}
			{!image && progress == 0 && (
				<p>Drag and drop an image here or click to upload</p>
			)}
			{progress > 0 && progress < 100 && (
				<p>Uploading: {progress.toFixed(0)}%</p>
			)}
			
		</label>
	);
};

export default UploadImage;
