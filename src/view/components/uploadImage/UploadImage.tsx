import React, { useState } from 'react';
import './UploadImage.scss';
import { Statement } from 'delib-npm';
import { setImageLocally } from './uploadImageCont';

interface Props {
	readonly statement: Statement;
	readonly fileInputRef?: React.RefObject<HTMLInputElement> | null;
	readonly image: string;
	readonly setImage: React.Dispatch<React.SetStateAction<string>>;
}

export default function UploadImage({
	statement,
	fileInputRef,
	image,
	setImage,
}: Props) {
	const [isDragging, setIsDragging] = useState(false);
	const [aspectRatio, setAspectRatio] = useState('');
	const [progress, setProgress] = useState(0);

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		try {
			if (!statement) throw new Error('statement is undefined');

			const file = event.target.files?.[0];
			if (file) {
				await setImageLocally(
					file,
					setAspectRatio,
					statement,
					setImage,
					setProgress
				);
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

			await setImageLocally(
				file,
				setAspectRatio,
				statement,
				setImage,
				setProgress
			);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<label
			className={`dropZone ${isDragging ? 'dropZoneActive' : ''}`}
			style={{ aspectRatio, border: image === '' ? '2px dashed #ccc' : 'none' }}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={(e) => e.preventDefault()}
			onDrop={handleDrop}
		>
			<input
				ref={fileInputRef}
				type='file'
				accept='image/*'
				onChange={handleFileChange}
				className='fileInput'
			/>

			{image !== '' && (
				<div
					style={{
						backgroundImage: `url(${image})`,
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
}
