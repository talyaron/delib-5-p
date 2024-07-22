import React, { useRef } from "react";
import * as XLSX from "xlsx";
import { collection, doc, setDoc } from "firebase/firestore";
import { DB } from "../config";
import Button from "../../../view/components/buttons/button/Button";
import UploadFileIcon from "../../../view/components/icons/UploadFileIcon";

//styles
import styles from "./setWaitingList.module.scss"

interface User {
  Name: string;
  Email: string;
  Phone: string;
}

const UploadExcel: React.FC = () => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			handleFileUpload(files[0]);
		}
	};

	const handleFileUpload = async (file: File) => {
		const reader = new FileReader();

		reader.onload = async (e) => {
			const arrayBuffer = e.target?.result as ArrayBuffer;
			const data = new Uint8Array(arrayBuffer);
			const binaryString = data.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
			const workbook = XLSX.read(binaryString, { type: "binary" });
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			const jsonData = XLSX.utils.sheet_to_json<User>(worksheet);

			for (const row of jsonData) {
				const { Name, Email, Phone } = row;

				if (Name && Email && Phone) {
					const newDocRef = doc(collection(DB, "awaitingUsers"));
					await setDoc(newDocRef, {
						name: Name,
						email: Email,
						phone: Phone,
					});
				}
			}
			alert("File has successfully uploaded");
		};
		reader.readAsArrayBuffer(file);
	};

	const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		fileInputRef.current?.click();
	};

	return (
		<div>
			<input
				className={styles.uploadInput}
				type="file"
				accept=".xlsx, .xls"
				onChange={handleFileChange}
				ref={fileInputRef}
			/>
			<Button
				icon={<UploadFileIcon />}
				text={"Upload members list"}
				onClick={handleButtonClick}
				className={"btn btn--affirmation"}
			/>
		</div>
	);
};

export default UploadExcel;
