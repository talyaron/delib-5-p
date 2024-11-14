// This file contains the SwitchScreens component which is used to switch between the different tabs within statement

// Third party imports
import { Screen, Statement, StatementSubscription, User } from 'delib-npm';

// Custom components

import StatementSettings from './settings/StatementSettings';
import StatementChat from './chat/StatementChat';
import Process from '../process/Process';

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
	handleShowTalker,
	setShowAskPermission,
}: Readonly<SwitchScreensProps>) {
	if (!statement) return null;

	switch (screen) {
		case Screen.CHAT:
			return (
				<StatementChat
					handleShowTalker={handleShowTalker}
					setShowAskPermission={setShowAskPermission}
				/>
			);
		case Screen.PROCESS:
			return <Process />;
		case Screen.SETTINGS:
			return <StatementSettings />;

		default:
			return (
				<StatementChat
					handleShowTalker={handleShowTalker}
					setShowAskPermission={setShowAskPermission}
				/>
			);
	}
}
