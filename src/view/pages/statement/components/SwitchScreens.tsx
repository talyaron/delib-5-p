// This file contains the SwitchScreens component which is used to switch between the different tabs whithin statement

// Third party imports
import { Screen, Statement, User } from "delib-npm";

// Custom components
// import Rooms from "./rooms/Rooms";
import Map from "./map/StatementMap";
import StatementChat from "./chat/StatementChat";
import StatementVote from "./vote/StatementVote";
import MassQuestions from "./massQuestions/MassQuestions";
import StatementSettings from "./settings/StatementSettings";
import Rooms from "./rooms/StatementRooms";
import Info from "./info/Info";
import DefaultSolutionsPage from "./solutions/DefaultSolutionsPage";

interface SwitchScreensProps {
    screen: string | undefined;
    statement: Statement | undefined;
    subStatements: Statement[];
    handleShowTalker: (statement: User | null) => void;
    setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;
    toggleAskNotifications: () => void;
}

export default function SwitchScreens({
	screen,
	statement,
	subStatements,
	handleShowTalker,
	setShowAskPermission,
	toggleAskNotifications,
}: Readonly<SwitchScreensProps>) {
	if (!statement) return null;

	switch (screen) {
	case Screen.DOC:
		return <Map statement={statement} />;

	case Screen.CHAT:
		return (
			<StatementChat
				statement={statement}
				subStatements={subStatements}
				handleShowTalker={handleShowTalker}
				setShowAskPermission={setShowAskPermission}
				toggleAskNotifications={toggleAskNotifications}
			/>
		);
	case Screen.OPTIONS:
		return (
			<DefaultSolutionsPage
				statement={statement}
				subStatements={subStatements}
				handleShowTalker={handleShowTalker}
				toggleAskNotifications={toggleAskNotifications}
			/>
		);
	case Screen.VOTE:
		return (
			<StatementVote
				statement={statement}
				subStatements={subStatements}
				toggleAskNotifications={toggleAskNotifications}
			/>
		);
	case Screen.MASS_QUESTIONS:
		return (
			<MassQuestions
				statement={statement}
				subStatements={subStatements}
			/>
		);
	case Screen.GROUPS:
		return (
			<Rooms statement={statement} subStatements={subStatements} />
		);
	case Screen.SETTINGS:
		return <StatementSettings />;
	case Screen.QUESTIONS:
		return (
			<DefaultSolutionsPage
				statement={statement}
				subStatements={subStatements}
				handleShowTalker={handleShowTalker}
				questions={true}
				toggleAskNotifications={toggleAskNotifications}
				currentPage="question"
			/>
		);
	case Screen.INFO:
		return(<Info statement={statement}/>)

	default:
		return (
			<StatementChat
				statement={statement}
				subStatements={subStatements}
				handleShowTalker={handleShowTalker}
				setShowAskPermission={setShowAskPermission}
				toggleAskNotifications={toggleAskNotifications}
			/>
		);
	}
}
