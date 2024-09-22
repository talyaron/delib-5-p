// import * as XLSX from "xlsx";
// import { doc, setDoc } from "firebase/firestore";
// import { DB } from "../config";
// import { Statement } from "delib-npm";

// interface User {
//   Name: string;
//   Email: string;
//   Phone: string;
// }

export const SetWaitingListCont = async (
	file: File, 

	// statement: Statement
) => {
	const reader = new FileReader();

	reader.onload = async () => {
		// const arrayBuffer = e.target?.result as ArrayBuffer;
		// const data = new Uint8Array(arrayBuffer);
		// const binaryString = data.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
		// const workbook = XLSX.read(binaryString, { type: "binary" });
		// const sheetName = workbook.SheetNames[0];
		// const worksheet = workbook.Sheets[sheetName];
		// const jsonData = XLSX.utils.sheet_to_json<User>(worksheet);

		// for (const row of jsonData) {
		// 	const { Name, Email, Phone } = row;

		// 	if (Name && Email && Phone) {
		// 		const waitingListId = `${statement.statementId}--${Email || Phone || "Error"}`;
		// 		const newDocRef = doc(DB, Collections.awaitingUsers, waitingListId);
		// 		await setDoc(newDocRef, {
		// 			name: Name,
		// 			email: Email,
		// 			phone: Phone,
		// 			waitingListId,
		// 			statementId: statement.statementId,
		// 		});
		// 	}
		// }
		alert("This feature is not available yet");
	};
	reader.readAsArrayBuffer(file);
};
