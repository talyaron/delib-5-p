// This file contains the SwitchScreens component which is used to switch between the different tabs within statement

// Third party imports
import { Screen, Statement, StatementSubscription, User } from 'delib-npm';

// Custom components
import Explanation from './explanation/Explanation';

interface SwitchScreensProps {
	screen: string | undefined;
	statement: Statement | undefined;
	subStatements: Statement[];
	statementSubscription: StatementSubscription | undefined;
	handleShowTalker: (statement: User | null) => void;
	setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SwitchScreens({
	screen,
	statement,
}: Readonly<SwitchScreensProps>) {
	if (!statement) return null;

	switch (screen) {
		case Screen.EXPLANATION:
			return <Explanation statement={statement} />;

		default:
			return <Explanation statement={statement} />;
	}
}
