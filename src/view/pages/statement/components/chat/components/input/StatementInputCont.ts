import { Statement, StatementType, User } from "delib-npm";
import {
    createStatement,
    setStatmentToDB,
} from "../../../../../../../functions/db/statements/setStatments";

export function handleAddStatement(
    message: string,
    statement: Statement,
    user: User | null,
) {
    try {
        if (!user) throw new Error("No user");

        //remove white spaces and \n
        const value = message.replace(/\s+/g, " ").trim();

        if (!value) throw new Error("No value");

        const newStatement: Statement | undefined = createStatement({
            text: value,
            parentStatement: statement,
            statementType: StatementType.statement,
        });
        if (!newStatement) throw new Error("No statement was created");

        setStatmentToDB({
            statement: newStatement,
            parentStatement: statement,
            addSubscription: false,
        });
    } catch (error) {
        console.error(error);
    }
}
