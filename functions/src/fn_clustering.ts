import { Collections, Statement } from "delib-npm";
import { db } from ".";
import 'dotenv/config';
import { genAI } from "./fn_findSimilarStatements";

interface SimpleStatement {
    statementId: string;
    statement: string;
    description: string;
}

export const getClusters = async (req: any, res: any) => {
    // cors(req, res, async () => {
    try {

        const parentId = req.query.parentId;

        if (!parentId) {
            res.status(400).send({ error: "parentId is required", ok: false });
            return;
        }

        const subStatementsRef = db.collection(Collections.statements);
        const q = subStatementsRef.where("parentId", "==", parentId).where("statementType", "in", ["result", "option"])
        const subStatementsDB = await q.get();
        if (subStatementsDB.size === 0) {
            res.status(404).send({ error: "No subStatements found", ok: false });
            return;
        }
        const subStatements: SimpleStatement[] = subStatementsDB.docs.map((doc) => {
            const { statementId, statement, description } = doc.data() as Statement;
            if (!statementId || !statement) return undefined;
            return { statementId, statement, description: description || "" };
        }).filter((subStatement): subStatement is SimpleStatement => subStatement !== undefined);

        const genAIResponse = await runGenAI(subStatements);

        res.send({ genAIResponse, ok: true });
        return;

    } catch (error: any) {
        res.status(500).send({ error: error.message, ok: false });
        return;
    }
    // })
}

function prompt(subStatements: SimpleStatement[]) {
    return `Given the following list of statements, please group them into topics based on the subject matter. Each topic should contain statements that discuss a similar issue. Return the results in a JSON format where each topic is a key and the corresponding value is a list of statements. 
    the input looks like this:
 **Input data format:**
[
  {
    "statementId": "1d6a3d3c-1f48-4ce8-a43d-1362a85d5a4c",
    "statement": "התנהגות הילדים היא בלתי אפשרית",
    "description": ""
  },
  # ... other statements ...
]

**Expected output format:**
{
  "topic A": [
    # statements related to topic A
  ],
  "topic B": [
    # statements related to topic B
  ]
}"
These are the sub statements input: ${JSON.stringify(subStatements)}
`
}






async function runGenAI(subStatements: SimpleStatement[]) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const _prompt = prompt(subStatements);
        console.log(_prompt);



        const result = await model.generateContent(_prompt);
console.log("result:", result);
        const response = result.response;
        const text = response.text();
       
        

        return extractJSON(text);
    } catch (error) {
        console.error('Error running GenAI', error);

        return [];
    }
}

function extractJSON(text:string){
    try {
        //remove ```JSON
        const startIndex = text.indexOf('{');
        console.log('startIndex', startIndex);
        const endIndex = text.lastIndexOf('}');
        console.log('endIndex', endIndex);
        if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
            console.error('Invalid JSON format');
            return { strings: [''] };
        }
        const jsonString = text.substring(startIndex, endIndex + 1);
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error extracting JSON', error);
    }
}