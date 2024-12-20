import { DeliberativeElement, Statement, StatementType, User } from "delib-npm";
import { defaultStatementSettings } from "./../../../settings/emptyStatementModel";
import {
	createStatement,
	setStatementToDB,
} from "@/controllers/db/statements/setStatements";

export function handleAddStatement(
	message: string,
	statement: Statement,
	user: User | null,

) {
	try {
		if (!user) throw new Error("No user");

		//remove white spaces and \n
		const title = message.split("\n")[0];
		const description = message
			.split("\n")
			.slice(1)
			.join("\n")

		if (!title) throw new Error("No value");

		const newStatement: Statement | undefined = createStatement({
			...defaultStatementSettings,
			hasChildren: true,
			text: title,
			description,
			statementType: StatementType.statement,
			parentStatement: statement,
			deliberativeElement: DeliberativeElement.general,
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
