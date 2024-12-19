import { Statement, User, Role } from "delib-npm";
import { createContext } from "react";



interface StatementContextProps {
	statement: Statement | undefined;
	talker: User | null;
	handleShowTalker: (talker: User | null) => void;
	handleSetNewStatement: (showPopup?: boolean) => void;
	role: Role | undefined;
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
	},
);