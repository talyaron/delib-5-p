import { uploadImageToStorage } from '@/controllers/db/images/setImages';
import { updateStatementMainImage } from '@/controllers/db/statements/setStatements';
import { Statement } from 'delib-npm';
import { compressImage } from './compressImage';

export const handleFileUpload = async (
	file: File,
	statement: Statement,
	setImage: React.Dispatch<React.SetStateAction<File | null>>,
	setProgress: React.Dispatch<React.SetStateAction<number>>
) => {
	try {
		setImage(null);

		const compressedFile = await compressImage(file, 200, setProgress);

		setImage(compressedFile);

		const imageURL = await uploadImageToStorage(compressedFile, statement);

		updateStatementMainImage(statement, imageURL);
	} catch (error) {
		console.error(error);
	}
};
