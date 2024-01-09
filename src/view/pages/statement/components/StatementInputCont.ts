import { Statement, StatementType, User } from "delib-npm";
import { createStatement, setStatmentToDB } from "../../../../functions/db/statements/setStatments";

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

        const newStatement: Statement | undefined = createStatement({
            text: _value,
            parentStatement: statement,
            statementType: StatementType.statement,
        });
        if (!newStatement) throw new Error("No statement was created");


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
