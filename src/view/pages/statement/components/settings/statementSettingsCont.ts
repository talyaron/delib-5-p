import {
    Statement,
    NavObject,
    Vote,
    Evaluation,
    StatementType,
    Screen,
} from "delib-npm";

// Helpers
import { getVoters } from "../../../../../controllers/db/vote/getVotes";
import { getEvaluations } from "../../../../../controllers/db/evaluation/getEvaluation";
import { navigateToStatementTab } from "../../../../../controllers/general/helpers";
import {
    createStatement,
    setStatementToDB,
    updateStatement,
} from "../../../../../controllers/db/statements/setStatements";
import {
    defaultResultsSettings,
    defaultStatementSettings,
} from "./emptyStatementModel";

// Get users that voted on options in this statement
export async function handleGetVoters(
    parentId: string | undefined,
    setVoters: React.Dispatch<React.SetStateAction<Vote[]>>,
    setClicked: React.Dispatch<React.SetStateAction<boolean>>,
) {
    if (!parentId) return;
    const voters = await getVoters(parentId);
    setVoters(voters);
    setClicked(true);
}

// Get users that evaluated on options in this statement
export async function handleGetEvaluators(
    parentId: string | undefined,
    setEvaluators: React.Dispatch<React.SetStateAction<Evaluation[]>>,
    setClicked: React.Dispatch<React.SetStateAction<boolean>>,
) {
    if (!parentId) return;
    const evaluators = await getEvaluations(parentId);
    setEvaluators(evaluators);
    setClicked(true);
}

// Check if sub-page is checked in stored statement
export function isSubPageChecked(
    statement: Statement | undefined,
    navObj: NavObject,
): boolean {
    try {
        //in case of a new statement
        if (!statement) {
            if (navObj.default === false) return false;
            else return true;
        }

        //in case of an existing statement
        const { subScreens } = statement;
        if (!subScreens) return true;
        if (subScreens.includes(navObj.link)) return true;

        return false;
    } catch (error) {
        console.error(error);

        return true;
    }
}

export async function handleSetStatement(
    ev: any,
    navigate: any,
    statementId: string | undefined,
    statement: Statement,
) {
    try {
        ev.preventDefault();
        const _statement = getStatementText(statement);

        // If statement title is empty, don't save
        if (!_statement) return;

        const {
            hasChildren,
            resultsBy,
            numberOfResults,
            enableAddEvaluationOption,
            enableAddVotingOption,
            enhancedEvaluation,
            showEvaluation,
            subScreens,
        } = getSetStatementData(statement);

        // If no statementId, user is on AddStatement page
        if (!statementId) {
            const newStatement = createStatement({
                text: _statement,
                subScreens,
                statementType: StatementType.question,
                parentStatement: "top",
                resultsBy,
                numberOfResults,
                hasChildren,
                enableAddEvaluationOption,
                enableAddVotingOption,
                enhancedEvaluation,
                showEvaluation,
            });
            if (!newStatement)
                throw new Error("newStatement had error in creating");

            await setStatementToDB({
                parentStatement: "top",
                statement: newStatement,
                addSubscription: true,
            });
            navigateToStatementTab(newStatement, navigate);

            return;
        }

        // If statementId, user is on Settings tab in statement page
        else {
            // update statement
            if (!statement) throw new Error("statement is undefined");

            const newStatement = updateStatement({
                statement,
                text: _statement,
                subScreens: subScreens,
                statementType: StatementType.question,
                resultsBy,
                numberOfResults,
                hasChildren,
                enableAddEvaluationOption,
                enableAddVotingOption,
                enhancedEvaluation,
                showEvaluation,
            });
            if (!newStatement)
                throw new Error("newStatement had not been updated");

            await setStatementToDB({
                parentStatement: statement,
                statement: newStatement,
                addSubscription: true,
            });
            navigateToStatementTab(newStatement, navigate);

            return;
        }
    } catch (error) {
        console.error(error);
    }
}

const getStatementText = (statement: Statement): string | null => {
    const titleAndDescription = statement.statement;
    const endOfTitle = titleAndDescription.indexOf("\n");
    let title = titleAndDescription.substring(0, endOfTitle);

    // TODO: add validation for title in UI
    if (!title || title.length < 2) return null;

    //add to title * at the beginning
    if (title && !title.startsWith("*")) {
        title = `*${title}`;
    }

    const startOfDescription = endOfTitle + 1;
    const description = titleAndDescription.substring(startOfDescription);

    return `${title}\n${description}`;
};

export const getStatementSettings = (statement: Statement) => {
    const statementSettings =
        statement.statementSettings ?? defaultStatementSettings;

    return {
        enableAddEvaluationOption: Boolean(
            statementSettings.enableAddEvaluationOption,
        ),
        enableAddVotingOption: Boolean(statementSettings.enableAddVotingOption),
        enhancedEvaluation: Boolean(statementSettings.enhancedEvaluation),
        showEvaluation: Boolean(statementSettings.showEvaluation),
        subScreens: statementSettings.subScreens ?? [],
    };
};

const getStatementSubScreens = (statement: Statement) => {
    const defaultSubScreens = [Screen.CHAT, Screen.OPTIONS];
    const subScreens = statement.subScreens ?? defaultSubScreens;

    // don't allow setting sub-screens as an empty array
    return subScreens.length === 0 ? defaultSubScreens : subScreens;
};

const getSetStatementData = (statement: Statement) => {
    const { resultsBy, numberOfResults } =
        statement.resultsSettings ?? defaultResultsSettings;
    const {
        enableAddEvaluationOption,
        enableAddVotingOption,
        enhancedEvaluation,
        showEvaluation,
    } = getStatementSettings(statement);

    return {
        hasChildren: Boolean(statement.hasChildren),
        subScreens: getStatementSubScreens(statement),
        resultsBy,
        numberOfResults,
        enableAddEvaluationOption,
        enableAddVotingOption,
        enhancedEvaluation,
        showEvaluation,
    };
};

interface ToggleSubScreenParams {
    subScreens: Screen[];
    screenLink: Screen;
    statement: Statement;
}

export const toggleSubScreen = ({
    subScreens,
    screenLink,
    statement,
}: ToggleSubScreenParams): Statement => {
    const checked = subScreens.includes(screenLink) ?? false;
    const newSubScreens = checked
        ? subScreens.filter((subScreen) => subScreen !== screenLink)
        : [...subScreens, screenLink];

    return {
        ...statement,
        subScreens: newSubScreens,
    };
};
