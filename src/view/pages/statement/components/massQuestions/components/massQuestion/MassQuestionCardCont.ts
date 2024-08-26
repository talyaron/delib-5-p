import { defaultStatementSettings } from "./../../../settings/emptyStatementModel";
import { Statement, StatementType, User } from "delib-npm";
import { store } from "../../../../../../../model/store";
import {
	createStatement,
	setStatementToDB,
	updateStatementText,
} from "../../../../../../../controllers/db/statements/setStatements";

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
		const title = text.split("\n")[0];
		const description = text.split("\n").slice(1).join("\n");


		if (answer) {
			//update statement
			updateStatementText(answer, title, description);

			return undefined;
		} else {
			//create new statement
			const statement: Statement | undefined = createStatement({
				...defaultStatementSettings,
				hasChildren: true,
				text,
				parentStatement: question,
				statementType: StatementType.option,
			});
			if (!statement) throw new Error("statement not created");

			setStatementToDB({
				statement,
				parentStatement: question,
				addSubscription: false,
			});
		}
	} catch (error) {
		console.error(error);

		return undefined;
	}
};
