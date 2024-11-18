import { uploadImageToStorage } from '@/controllers/db/images/setImages';
import { updateStatementMainImage } from '@/controllers/db/statements/setStatements';
import { Statement } from 'delib-npm';
import { compressImage } from './compressImage';

export async function setImageLocally(
	file: File,
	setAspectRatio: React.Dispatch<React.SetStateAction<string>>,
	statement: Statement,
	setImage: React.Dispatch<React.SetStateAction<string>>,
	setProgress: React.Dispatch<React.SetStateAction<number>>
) {
	setImage("");

	if (file) {
		const img = new Image();
		const reader = new FileReader();

		reader.onloadend = () => {
			if (reader.result) {
				img.src = reader.result as string;

				img.onload = async () => {
					const width = img.naturalWidth;
					const height = img.naturalHeight;

					setAspectRatio(`${width}/${height}`);

					const compressedFile = await compressImage(file, 200, setProgress);

					setImage(URL.createObjectURL(compressedFile));

					const imageURL = await uploadImageToStorage(
						compressedFile,
						statement
					);

					updateStatementMainImage(statement, imageURL);
				};
			}
		};

		reader.readAsDataURL(file);
	}
}
