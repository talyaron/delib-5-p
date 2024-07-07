export interface Password {
	password: string;
	expiryDate: Date;
	statementId: string;
}

// Function generates a 4 number password for a statement and sets an expiry date for the password
export function generatePasswordForStatement(statementId: string): Password {
	const password = Math.floor(1000 + Math.random() * 9000).toString();
	const expiryDate = new Date();
	expiryDate.setHours(expiryDate.getHours() + 1);
	
	const passwordObj: Password = {
		password,
		expiryDate,
		statementId,
	};
	
	return passwordObj;
}
