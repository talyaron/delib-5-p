import { Screen, Statement, StatementType, User } from "delib-npm";
import { getNewStatment } from "../../../../functions/general/helpers";
import { setStatmentToDB } from "../../../../functions/db/statements/setStatments";

export function handleAddStatement(
    e: any,
    statement: Statement,
    user: User | null
) {
    try {
        e.preventDefault();
        if (!user) throw new Error("No user");

        if (!user) throw new Error("No user");

        const value = e.target.newStatement.value;

        //remove white spaces and \n
        const _value = value.replace(/\s+/g, " ").trim();

        if (!_value) throw new Error("No value");

        const newStatement: Statement | undefined = getNewStatment({
            value,
            parentStatement: statement,
            statementType: StatementType.statement,
        });
        if (!newStatement) throw new Error("No statement");

        newStatement.subScreens = [Screen.CHAT, Screen.OPTIONS, Screen.VOTE];

        setStatmentToDB({
            statement: newStatement,
            parentStatement: statement,
            addSubscription: true,
        });

        e.target.reset();
    } catch (error) {
        console.error(error);
    }
}
