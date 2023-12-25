import { Statement, StatementType, User } from "delib-npm";
import { getNewStatment } from "../../../../../../../functions/general/helpers";
import { store } from "../../../../../../../model/store";
import { setStatmentToDB } from "../../../../../../../functions/db/statements/setStatments";

interface handleSetQuestionFromMassCardProps {
    question: Statement;
    text: string;
}

export const handleSetQuestionFromMassCard = ({
    question,
    text
}: handleSetQuestionFromMassCardProps) => {
    try {
        const user: User | null = store.getState().user.user;
        if (!user) throw new Error("user not found");
        if (!text) return;
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
