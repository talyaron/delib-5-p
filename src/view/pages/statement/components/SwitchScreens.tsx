// This file contains the SwitchScreens component which is used to switch between the different tabs whithin statement

// Third party imports
import { Screen, Statement, User } from "delib-npm";

// Custom components
import Map from "./map/Map";
import StatementChat from "./chat/StatementChat";
import StatementEvaluation from "./evaluations/StatementEvaluation";
import StatementVote from "./vote/StatementVote";
import MassQuestions from "./massQuestions/MassQuestions";
import StatmentRooms from "./rooms/Rooms";
import StatementSettings from "./settings/StatementSettings";

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
}: SwitchScreensProps) {
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
                <StatementEvaluation
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
                <StatmentRooms
                    statement={statement}
                    subStatements={subStatements}
                />
            );
        case Screen.SETTINGS:
            return <StatementSettings />;
        case Screen.QUESTIONS:
            return (
                <StatementEvaluation
                    statement={statement}
                    subStatements={subStatements}
                    handleShowTalker={handleShowTalker}
                    questions={true}
                    toggleAskNotifications={toggleAskNotifications}
                />
            );

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
