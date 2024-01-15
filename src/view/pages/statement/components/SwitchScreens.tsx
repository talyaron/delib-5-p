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
                <Suspense fallback={<SuspenseFallback />}>
                    <StatementMain
                        statement={statement}
                        subStatements={subStatements}
                        handleShowTalker={handleShowTalker}
                    />
                </Suspense>
            );
        case Screen.OPTIONS:
            return (
                <Suspense fallback={<SuspenseFallback />}>
                    <StatementEvaluation
                        statement={statement}
                        subStatements={subStatements}
                        handleShowTalker={handleShowTalker}
                    />
                </Suspense>
            );
        case Screen.VOTE:
            return (
                <Suspense fallback={<SuspenseFallback />}>
                    <StatementVote
                        statement={statement}
                        subStatements={subStatements}
                    />
                </Suspense>
            );
        case Screen.MASS_QUESTIONS:
            return (
                <Suspense fallback={<SuspenseFallback />}>
                    <MassQuestions
                        statement={statement}
                        subStatements={subStatements}
                    />
                </Suspense>
            );
        case Screen.GROUPS:
            return (
                <Suspense fallback={<SuspenseFallback />}>
                    <StatmentRooms
                        statement={statement}
                        subStatements={subStatements}
                    />
                </Suspense>
            );
        case Screen.SETTINGS:
            return (
                <Suspense fallback={<SuspenseFallback />}>
                    <StatementSettings />;
                </Suspense>
            );
        case Screen.QUESTIONS:
        case Screen.QUESTIONS_CONSENSUS:
        case Screen.QUESTIONS_NEW:
        case Screen.QUESTIONS_RANDOM:
        case Screen.QUESTIONS_UPDATED:
            return (
                <Suspense fallback={<SuspenseFallback />}>
                    <StatementEvaluation
                        statement={statement}
                        subStatements={subStatements}
                        handleShowTalker={handleShowTalker}
                        questions={true}
                    />
                </Suspense>
            );

        default:
            return (
                <Suspense fallback={<SuspenseFallback />}>
                    <StatementMain
                        statement={statement}
                        subStatements={subStatements}
                        handleShowTalker={handleShowTalker}
                    />
                </Suspense>
            );
    }
}
