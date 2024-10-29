import { Collections, Statement } from "delib-npm";
import { storage } from "../config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export function uploadImageToStorage(
	file: File,
	statement: Statement,
	setProgress: (progress: number) => void,
): Promise<string> {
	return new Promise((resolve, reject) => {
		const imageRef = ref(
			storage,
			`${Collections.statements}/${
				statement.statementId
			}/imgId-${Math.random()}`,
		);

		const uploadTask = uploadBytesResumable(imageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

				setProgress(progress);
				switch (snapshot.state) {
				case "paused":
					console.info("Upload is paused");
					break;
				case "running":
					console.info("Upload is running");
					break;
				}
			},
			(error) => {
				console.error(error);
				reject(error);
			},
			async () => {
				try {
					const downloadURL = await getDownloadURL(
						uploadTask.snapshot.ref,
					);
					resolve(downloadURL);
				} catch (error) {
					console.error("Error retrieving download URL:", error);
					reject(error);
				}
			},
		);
	});
}
