export const findSimilarStatements = (statementId: string, userInput: string) =>
	fetch('https://checkforsimilarstatements-7qsv67fbvq-uc.a.run.app', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ statementId, userInput }),
	})
		.then((res) => res.json())
		.catch((error) => console.error(error));
