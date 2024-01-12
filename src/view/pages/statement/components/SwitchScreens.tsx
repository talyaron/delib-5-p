// Custom components
import StatementMain from "./StatementMain";
import StatmentRooms from "./rooms/Rooms";
import StatementVote from "./vote/StatementVote";
import StatementEvaluation from "./evaluations/StatementEvaluation";
import Map from "./map/Map";

// Third party imports
import { Screen, Statement, User } from "delib-npm";
import { StatementSettings } from "./settings/StatementSettings";
import MassQuestions from "./massQuestions/MassQuestions";

interface SwitchScreensProps {
    screen: string | undefined;
    statement: Statement | undefined;
    subStatements: Statement[];
    handleShowTalker: (statement: User | null) => void;
}

export default function SwitchScreens({
    screen,
    statement,
    subStatements,
    handleShowTalker,
}: SwitchScreensProps) {
    if (!statement) return null;

    switch (screen) {
        case Screen.DOC:
            return <Map statement={statement} />;

        //TODO: Delete? Not used.
        // case Screen.HOME:
        //     return (
        //         <StatementMain
        //             statement={statement}
        //             subStatements={subStatements}
        //             handleShowTalker={handleShowTalker}
        //         />
        //     );
        case Screen.CHAT:
            return (
                <StatementMain
                    statement={statement}
                    subStatements={subStatements}
                    handleShowTalker={handleShowTalker}
                />
            );
        case Screen.OPTIONS:
            return (
                <StatementEvaluation
                    statement={statement}
                    subStatements={subStatements}
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
                <StatmentRooms
                    statement={statement}
                    subStatements={subStatements}
                />
            );
        case Screen.SETTINGS:
            return <StatementSettings />;
        case Screen.QUESTIONS:
        case Screen.QUESTIONS_CONSENSUS:
        case Screen.QUESTIONS_NEW:
        case Screen.QUESTIONS_RANDOM:
        case Screen.QUESTIONS_UPDATED:
            return (
                <StatementEvaluation
                    statement={statement}
                    subStatements={subStatements}
                    handleShowTalker={handleShowTalker}
                    questions={true}
                />
            );

        default:
            return (
                <StatementMain
                    statement={statement}
                    subStatements={subStatements}
                    handleShowTalker={handleShowTalker}
                />
            );
    }
}
