async function generatePassword(statementId: string | undefined) {
	try {
		const plainPassword = Math.floor(1000 + Math.random() * 9000);
		console.log(plainPassword);

		const response = await fetch("http://localhost:5001/delib-v3-dev/us-central1/hashPassword", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				statementId: statementId,
				plainPassword: plainPassword,
			}),
		});

		if (response.ok) {
			const responseData = await response.json();
			
			return responseData.ok;
		} else {
			console.error("Error posting to server:", response.status, response.statusText);
		}
	} catch (error) {
		console.error("Error in HTTP request:", error);
	}
}

export default generatePassword;
