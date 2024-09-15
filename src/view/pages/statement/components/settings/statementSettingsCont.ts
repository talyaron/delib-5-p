import {
	Statement,
	NavObject,
	Vote,
	Evaluation,
	StatementType,
	Screen,
} from "delib-npm";

// Helpers
import { getVoters } from "@/controllers/db/vote/getVotes";
import { getEvaluations } from "@/controllers/db/evaluation/getEvaluation";
import { navigateToStatementTab } from "@/controllers/general/helpers";
import {
	createStatement,
	setStatementToDB,
	updateStatement,
} from "@/controllers/db/statements/setStatements";
import {
	defaultResultsSettings,
	defaultStatementSettings,
} from './emptyStatementModel';
import { NavigateFunction } from 'react-router-dom';


// Get users that voted on options in this statement
export async function handleGetVoters(
	parentId: string | undefined,
	setVoters: React.Dispatch<React.SetStateAction<Vote[]>>,
	setClicked: React.Dispatch<React.SetStateAction<boolean>>
) {
	if (!parentId) return;
	const voters = await getVoters(parentId);
	setVoters(voters);
	setClicked(true);
}

//Get users that did not vote on options in this statement
export async function handleGetNonVoters(
	parentId: string | undefined,
	setNonVoters: React.Dispatch<React.SetStateAction<Vote[]>>,
	setClicked: React.Dispatch<React.SetStateAction<boolean>>
) {
	if (!parentId) return;

	try {
		const voters = await getVoters(parentId);

		// Filter out users who haven't voted (those with no voter information)
		const nonVoters = voters.filter((voter) => !voter.voter);

		setNonVoters(nonVoters);

		setClicked(true);
	} catch (error) {
		console.error("Error fetching non-voters:", error);
	}
}

// Get users that evaluated on options in this statement
export async function handleGetEvaluators(
	parentId: string | undefined,
	setEvaluators: React.Dispatch<React.SetStateAction<Evaluation[]>>,
	setClicked: React.Dispatch<React.SetStateAction<boolean>>
) {
	if (!parentId) return;
	const evaluators = await getEvaluations(parentId);
	setEvaluators(evaluators);
	setClicked(true);
}

// Check if sub-page is checked in stored statement
export function isSubPageChecked(
	statement: Statement | undefined,
	navObj: NavObject
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

interface HandleSetStatementParams {
  navigate: NavigateFunction;
  statementId: string | undefined;
  statement: Statement;
  parentStatement?: Statement | "top";
}

export async function handleSetStatement({
	navigate,
	statementId,
	statement,
	parentStatement,
}: HandleSetStatementParams) {
	try {
		// If statement title is empty, don't save
		if (!statement.statement) return;

		const {
			hasChildren,
			resultsBy,
			numberOfResults,
			enableAddEvaluationOption,
			enableAddVotingOption,
			enhancedEvaluation,
			showEvaluation,
			subScreens,
			membership,
		} = getSetStatementData(statement);

		// If no statementId, user is on AddStatement page
		if (!statementId) {
			const newStatement = createStatement({
				text: statement.statement,
				description: statement.description,
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
				membership,
			});
			if (!newStatement) throw new Error("newStatement had error in creating");

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
				text: statement.statement,
				description: statement.description || "",
				subScreens: subScreens,
				statementType: StatementType.question,
				resultsBy,
				numberOfResults,
				hasChildren,
				enableAddEvaluationOption,
				enableAddVotingOption,
				enhancedEvaluation,
				showEvaluation,
				membership,
			});
			if (!newStatement) throw new Error("newStatement had not been updated");

			await setStatementToDB({
				parentStatement,
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

export const getStatementSettings = (statement: Statement) => {
	const statementSettings =
    statement.statementSettings ?? defaultStatementSettings;

	return {
		enableAddEvaluationOption: Boolean(
			statementSettings.enableAddEvaluationOption
		),
		enableAddVotingOption: Boolean(statementSettings.enableAddVotingOption),
		enhancedEvaluation: Boolean(statementSettings.enhancedEvaluation),
		showEvaluation: Boolean(statementSettings.showEvaluation),
		subScreens: statementSettings.subScreens ?? [],
		inVotingGetOnlyResults: Boolean(statementSettings.inVotingGetOnlyResults),
		enableSimilaritiesSearch: Boolean(
			statementSettings.enableSimilaritiesSearch
		),
		enableNavigationalElements: Boolean(
			statementSettings.enableNavigationalElements
		),
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
		membership: statement.membership,
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

interface CreateStatementFromModalParams {
  title: string;
  description: string;
  isOptionSelected: boolean;
  parentStatement: Statement | "top";
  isSendToStoreTemp?: boolean;
}

export async function createStatementFromModal({
	title,
	description,
	isOptionSelected,
	parentStatement
}: CreateStatementFromModalParams) {
	try {
		if (!title) throw new Error("title is undefined");

		const newStatement = createStatement({
			...defaultStatementSettings,
			hasChildren: true,
			text: title,
			description,
			parentStatement,
			statementType: isOptionSelected
				? StatementType.option
				: StatementType.question,
		});

		if (!newStatement) throw new Error("newStatement was not created");

		await setStatementToDB({
			statement: newStatement,
			parentStatement: parentStatement === "top" ? undefined : parentStatement,
			addSubscription: true,
		});

		await setStatementToDB({
			statement: newStatement,
			parentStatement: parentStatement === 'top' ? undefined : parentStatement,
			addSubscription: true,
		});

		
	} catch (error) {
		console.error(error);
	}
}
