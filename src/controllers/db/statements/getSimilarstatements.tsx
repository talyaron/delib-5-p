export const findSimilarStatements = async (
	statementId: string,
	userInput: string
) => {
	const url =
		location.hostname === 'localhost'
			? 'http://localhost:5001/delib-testing/us-central1/checkForSimilarStatements'
			: 'https://checkforsimilarstatements-7qsv67fbvq-uc.a.run.app';

	const body = { statementId, userInput };

	try {
		const res = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(body),
		});

		return await res.json();
	} catch (error) {
		return console.error(error);
	}
};
