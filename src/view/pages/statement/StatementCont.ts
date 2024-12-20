import { Statement, User, Role, StatementType } from "delib-npm";
import { createContext } from "react";

interface StatementContextProps {
	statement: Statement | undefined;
	talker: User | null;
	handleShowTalker: (talker: User | null) => void;
	handleSetNewStatement: (showPopup?: boolean) => void;
	role: Role | undefined;
	setNewStatementType: (newStatementType: StatementType) => void;
	newStatementType: StatementType; //used to determine the type of the new statement when created
}

export const StatementContext = createContext<StatementContextProps>(
	{
		statement: undefined,
		talker: null,
		role: undefined,
		handleSetNewStatement: () => { },
		handleShowTalker: () => {
			return;
		},
		setNewStatementType: () => {
			return;
		},
		newStatementType: StatementType.group,
	},
);