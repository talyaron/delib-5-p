import { Screen, Statement, User } from "delib-npm";
import Map from "./map/Map";
import StatementMain from "./StatementMain";
import StatementEvaluation from "./evaluations/StatementEvaluation";
import StatementVote from "./vote/StatementVote";
import MassQuestions from "./massQuestions/MassQuestions";
import StatmentRooms from "./rooms/Rooms";
import StatementSettings from "./settings/StatementSettings";

// Custom components


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
            // const Map = lazy(() => import("./map/Map"));

            return <Map statement={statement} />;

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
