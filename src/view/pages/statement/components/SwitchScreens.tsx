// This file contains the SwitchScreens component which is used to switch between the different tabs whithin statement

// Third party imports
import { Screen, Statement, StatementSubscription, User } from "delib-npm";

// Custom components
// import Rooms from "./rooms/Rooms";
import Map from "./map/StatementMap";
import StatementChat from "./chat/StatementChat";
import StatementEvaluationPage from "./solutions/StatementSolutionsPage";
import StatementVote from "./vote/StatementVote";
import MassQuestions from "./massQuestions/MassQuestions";
import StatementSettings from "./settings/StatementSettings";
import Rooms from "./rooms/Rooms";
import Info from "./info/Info";

interface SwitchScreensProps {
    screen: string | undefined;
    statement: Statement | undefined;
    subStatements: Statement[];
	statementSubscription:StatementSubscription | undefined;
    handleShowTalker: (statement: User | null) => void;
    setShowAskPermission: React.Dispatch<React.SetStateAction<boolean>>;

}

export default function SwitchScreens({
	screen,
	statement,
	subStatements,
	statementSubscription,
	handleShowTalker,
	setShowAskPermission,

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
			
			/>
		);
	case Screen.OPTIONS:
		return (
			<StatementEvaluationPage
				statement={statement}
				handleShowTalker={handleShowTalker}
			
			/>
		);
	case Screen.VOTE:
		return (
			<StatementVote
				statement={statement}
				subStatements={subStatements}
				
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
			<Rooms statement={statement} subStatements={subStatements} statementSubscription={statementSubscription} />
		);
	case Screen.SETTINGS:
		return <StatementSettings />;
	case Screen.QUESTIONS:
		return (
			<StatementEvaluationPage
				statement={statement}
				handleShowTalker={handleShowTalker}
				questions={true}
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
			/>
		);
	}
}
