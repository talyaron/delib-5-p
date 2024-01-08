import { Statement, StatementType, User } from "delib-npm";
import { getNewStatment } from "../../../../../../../functions/general/helpers";
import { store } from "../../../../../../../model/store";
import {
    setStatmentToDB,
    updateStatementText,
} from "../../../../../../../functions/db/statements/setStatments";

interface handleSetQuestionFromMassCardProps {
    question: Statement;
    text: string;
    answer: Statement | null;
}

export const handleSetQuestionFromMassCard = ({
    question,
    answer,
    text,
}: handleSetQuestionFromMassCardProps) => {
    try {
        const user: User | null = store.getState().user.user;
        if (!user) throw new Error("user not found");
        if (!text) return;

        if (answer) {
            //update statement
            updateStatementText(answer, text);
            return undefined;
        } else {

            //create new statement
            const statement: Statement | undefined = getNewStatment({
                value: text,
                parentStatement: question,
                statementType: StatementType.option
            });
            if (!statement) throw new Error("statement not created");

            setStatmentToDB({statement, parentStatement: question, addSubscription:false});
        }
    } catch (error) {
        console.error(error);
        return undefined;
    }
};
