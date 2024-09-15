export const findSimilarStatements = async (
	statementId: string,
	userInput: string
) => {
	const prodEndPoint =
		'https://checkforsimilarstatements-qeesi7aziq-uc.a.run.app';

	// const devEndPoint =
	// 	'https://checkforsimilarstatements-oeqnq63ina-uc.a.run.app';
	const localEndPoint =
		'http://localhost:5001/synthesistalyaron/us-central1/checkForSimilarStatements';
	const url = () => {
		

		if (location.hostname !== 'localhost') {
			return prodEndPoint;
		} else {
			return localEndPoint;
		}
	};

	const body = { statementId, userInput };

	try {
		const res = await fetch(url(), {
			method: 'POST',
			body: JSON.stringify(body),
		});

		return await res.json();
	} catch (error) {
		return console.error(error);
	}
};