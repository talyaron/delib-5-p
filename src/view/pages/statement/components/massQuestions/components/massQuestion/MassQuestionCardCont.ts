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
            console.log("update");
            updateStatementText(answer, text);
            return undefined;
        }
console.log("create");
        const statement: Statement | undefined = getNewStatment({
            value: text,
            statement: question,
            statementType: StatementType.option,
            user,
        });
        if (!statement) throw new Error("statement not created");

        setStatmentToDB(statement);
    } catch (error) {
        console.error(error);
        return undefined;
    }
};
