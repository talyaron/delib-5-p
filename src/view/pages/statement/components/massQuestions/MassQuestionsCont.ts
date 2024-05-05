import { Statement, StatementSchema } from "delib-npm";
import { z } from "zod";
import { setStatementToDB } from "../../../../../controllers/db/statements/setStatements";

export async function handleSetAnswersToDB(answers: Statement[]) {
    try {
        z.array(StatementSchema).parse(answers);
        answers.forEach(async (answer) => {
            setStatementToDB({ statement: answer, addSubscription: false });
        });
    } catch (error) {
        console.error(error);

        return undefined;
    }
}
