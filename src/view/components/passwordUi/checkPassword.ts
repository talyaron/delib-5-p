export async function checkPassword(userCodeInput: number, statementId: string, userId: string): Promise<boolean> {
	try {
		const response = await fetch("http://localhost:5001/delib-v3-dev/us-central1/checkPassword", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userCodeInput, statementId, userId }),
		});

		if (response.ok) {
			const responseData = await response.json();
			
			return responseData.ok;
		} else {
			console.error("Error checking password:", response.status, response.statusText);
			
			return false;
		}
	} catch (error) {
		console.error("Error in HTTP request:", error);
		
		return false;
	}
}
