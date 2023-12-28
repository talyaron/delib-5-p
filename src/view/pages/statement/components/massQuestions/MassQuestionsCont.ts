import { Statement, StatementSchema } from "delib-npm";
import { z } from "zod";
import { setStatmentToDB } from "../../../../../functions/db/statements/setStatments";

export async function handleSetAnswersToDB(answers: Statement[]) {
    try {
        z.array(StatementSchema).parse(answers);
        answers.forEach(async (answer) => {
            setStatmentToDB(answer);
        });
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
