import { GoogleGenerativeAI } from '@google/generative-ai';
import { Collections, Statement } from 'delib-npm';
import { defineSecret } from 'firebase-functions/params';
import { Response, onInit } from 'firebase-functions/v1';
import { Request } from 'firebase-functions/v2/https';
import { db } from '.';

export async function findSimilarStatements(
	request: Request,
	response: Response
) {
	const statementId = request.body.statementId as string;

	const query = db
		.collection(Collections.statements)
		.where('parents', 'array-contains', statementId)
		.where('statementType', '==', 'statement')
		.where('statementId', '!=', statementId);

	const subStatementsDB = await query.get();

	const subStatements = subStatementsDB.docs.map((doc) =>
		doc.data()
	) as Statement[];

	const statementsText = subStatements.map(
		(subStatement) => subStatement.statement
	);

	const genAiResponse = await runGenAI(statementsText);

	response.status(200).send(genAiResponse);
}

const apiKey = defineSecret('GOOGLE_API_KEY');

let genAI: GoogleGenerativeAI;

onInit(() => {
	genAI = new GoogleGenerativeAI(apiKey.value());
});

export async function runGenAI(inputArr: string[]) {
	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

	const input = 'go eat dinner with colleagues';

	const prompt = `
		Find the strings in the following text that are similar to '${input}': ${inputArr}. 
		Consider a match if the sentence shares at least 70% similarity in meaning.
		Give answer back in this json format: { strings: ['string1', 'string2', ...] }
	`;

	const result = await model.generateContent(prompt);

	const response = result.response;
	const text = response.text();

	return extractAndParseJsonString(text).strings;
}

function extractAndParseJsonString(input: string): { strings: string[] } {
	try {
		// Find the first '{' and the last '}'
		const startIndex = input.indexOf('{');
		const endIndex = input.lastIndexOf('}');

		if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
			throw new Error('No valid JSON found in the input');
		}

		// Extract the JSON substring
		const jsonString = input.substring(startIndex, endIndex + 1);

		// Parse the JSON string
		const parsedObject = JSON.parse(jsonString);

		// Validate the structure of the parsed object
		if (parsedObject && Array.isArray(parsedObject.strings)) {
			return parsedObject;
		} else {
			throw new Error('Invalid JSON structure');
		}
	} catch (error) {
		throw new Error('Failed to parse JSON: ' + error);
	}
}
