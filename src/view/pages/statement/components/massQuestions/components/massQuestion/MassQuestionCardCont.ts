import { Statement, StatementType, User } from "delib-npm";
import { getNewStatment } from "../../../../../../../functions/general/helpers";
import { store } from "../../../../../../../model/store";

export async function handleSetQuestionFromMassCard(
    question: Statement,
    text: string,
    answers:Statement[],
    index:number
) {
    try {
        const user: User | null = store.getState().user.user;
        if (!user) throw new Error("user not found");
        if(!text) return;
        const statement: Statement | undefined = getNewStatment({
            value: text,
            statement: question,
            statementType: StatementType.option,
            user,
        });
        if (!statement) throw new Error("statement not created");

        answers[index] = statement;
        console.log(answers);
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
