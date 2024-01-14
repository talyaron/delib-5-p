import { Suspense, lazy } from "react";

// Third party imports
import { Screen, Statement, User } from "delib-npm";

// Custom components
const StatementVote = lazy(() => import("./vote/StatementVote"));
const StatementEvaluation = lazy(
    () => import("./evaluations/StatementEvaluation"),
);
const StatmentRooms = lazy(() => import("./rooms/Rooms"));
const StatementMain = lazy(() => import("./StatementMain"));
const StatementSettings = lazy(() => import("./settings/StatementSettings"));
const Map = lazy(() => import("./map/Map"));
const MassQuestions = lazy(() => import("./massQuestions/MassQuestions"));

// Custom components
import { SuspenseFallback } from "../../../../router";

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

            return (
                <Suspense fallback={<SuspenseFallback />}>
                    <Map statement={statement} />;
                </Suspense>
            );

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
