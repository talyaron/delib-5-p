import { GoogleGenerativeAI } from '@google/generative-ai';
import { Collections, Statement } from 'delib-npm';
import { Response, onInit } from 'firebase-functions/v1';
import { Request } from 'firebase-functions/v2/https';
import { db } from '.';
import 'dotenv/config';


export async function findSimilarStatements(
	request: Request,
	response: Response
) {
	const parsedBody = JSON.parse(request.body);
	const { statementId, userInput } = parsedBody;

	const ref = db.collection(Collections.statements);
	const query = ref.where('parentId', '==', statementId);

	const subStatementsDB = await query.get();

	const subStatements = subStatementsDB.docs.map((doc) =>
		doc.data()
	) as Statement[];

	const statementsText = subStatements.map((subStatement) => ({
		statement: subStatement.statement,
		id: subStatement.statementId,
	}));
	

	if (statementsText.length === 0) {
		response.status(200).send([]);

		return;
	}

	const genAiResponse = await runGenAI(
		statementsText.map((s) => s.statement),
		userInput
	);
	

	const similarStatementsIds = statementsText
		.filter((subStatement) => genAiResponse.includes(subStatement.statement))
		.map((subStatement) => subStatement.id);

	

	response.status(200).send(similarStatementsIds);
}

let genAI: GoogleGenerativeAI;

onInit(() => {
	try {
		if (!process.env.GOOGLE_API_KEY) {
			throw new Error('Missing GOOGLE_API_KEY environment variable');
		}
		
		genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
	} catch (error) {
		console.error('Error initializing GenAI', error);
	}

});



export async function runGenAI(allStatements: string[], userInput: string) {
	try {
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

		const prompt = `
		Find the sentences in the following strings:  ${allStatements},  that are similar to the user input '${userInput}'. 
		The use Input can be either in English or in Hebrew. Look for similar strings to the user input in both languages.
		Consider a match if the sentence shares at least 60% similarity in meaning the user input.
		Give answer back in this json format: { strings: ['string1', 'string2', ...] }
		`;

		

		const result = await model.generateContent(prompt);

		const response = result.response;
		const text = response.text();

		return extractAndParseJsonString(text).strings;
	} catch (error) {
		console.error('Error running GenAI', error);

		return [];
	}
}


function extractAndParseJsonString(input: string): { strings: string[] } {
	try {
		// Find the first '{' and the last '}'
		const startIndex = input.indexOf('{');
		const endIndex = input.lastIndexOf('}');

		if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
			console.error('Invalid JSON format');

			return { strings: [''] };
		}

		// Extract the JSON substring
		const jsonString = input.substring(startIndex, endIndex + 1);

		// Parse the JSON string
		const parsedObject = JSON.parse(jsonString);

		// Validate the structure of the parsed object
		if (parsedObject && Array.isArray(parsedObject.strings)) {
			return parsedObject;
		} else {
			console.error('Invalid JSON structure');

			return { strings: [''] };
		}
	} catch (error) {
		console.error('Error parsing JSON', error);

		return { strings: [''] };
	}
}
