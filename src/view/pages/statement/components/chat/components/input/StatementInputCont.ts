import { defaultStatementSettings } from "./../../../settings/emptyStatementModel";
import { Statement, StatementType, User } from "delib-npm";
import {
	createStatement,
	setStatementToDB,
} from "../../../../../../../controllers/db/statements/setStatements";

export function handleAddStatement(
	message: string,
	statement: Statement,
	user: User | null,
	toggleAskNotifications: () => void,
) {
	try {
		if (!user) throw new Error("No user");

		//remove white spaces and \n
		const value = message.replace(/\s+/g, " ").trim();

		if (!value) throw new Error("No value");

		const newStatement: Statement | undefined = createStatement({
			...defaultStatementSettings,
			hasChildren: true,
			text: value,
			parentStatement: statement,
			statementType: StatementType.statement,
			toggleAskNotifications,
		});
		if (!newStatement) throw new Error("No statement was created");

		setStatementToDB({
			statement: newStatement,
			parentStatement: statement,
			addSubscription: false,
		});
	} catch (error) {
		console.error(error);
	}
}
