import {
	Statement,
	NavObject,
	Vote,
	Evaluation,
	StatementType,
	Screen,
} from 'delib-npm';

// Helpers
import { getVoters } from '../../../../../controllers/db/vote/getVotes';
import { getEvaluations } from '../../../../../controllers/db/evaluation/getEvaluation';
import { navigateToStatementTab } from '../../../../../controllers/general/helpers';
import {
	createStatement,
	setStatementToDB,
	updateStatement,
} from '../../../../../controllers/db/statements/setStatements';
import {
	defaultResultsSettings,
	defaultStatementSettings,
} from './emptyStatementModel';
import { NavigateFunction } from 'react-router-dom';
import { store } from '../../../../../model/store';
import { setTempStatementsForPresentation } from '../../../../../model/statements/statementsSlice';

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
	parentStatement?: Statement | 'top';
}

export async function handleSetStatement({
	navigate,
	statementId,
	statement,
	parentStatement,
}: HandleSetStatementParams) {
	try {
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
				parentStatement: 'top',
				resultsBy,
				numberOfResults,
				hasChildren,
				enableAddEvaluationOption,
				enableAddVotingOption,
				enhancedEvaluation,
				showEvaluation,
			});
			if (!newStatement) throw new Error('newStatement had error in creating');

			await setStatementToDB({
				parentStatement: 'top',
				statement: newStatement,
				addSubscription: true,
			});
			navigateToStatementTab(newStatement, navigate);

			return;
		}

		// If statementId, user is on Settings tab in statement page
		else {
			// update statement
			if (!statement) throw new Error('statement is undefined');

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
			if (!newStatement) throw new Error('newStatement had not been updated');

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

const prefixTitle = (title: string): string => {
	if (title && !title.startsWith('*')) {
		return `*${title}`;
	}

	return title;
};

const getStatementText = (statement: Statement): string | null => {
	try {
		const titleAndDescription = statement.statement;
		const endOfTitle = titleAndDescription.indexOf('\n');
		const _title =
			endOfTitle === -1
				? titleAndDescription
				: titleAndDescription.substring(0, endOfTitle);

		// TODO: add validation for title in UI
		if (!_title || _title.length < 2) return null;

		const startOfDescription = endOfTitle + 1;
		const description = titleAndDescription.substring(startOfDescription);
		const title = prefixTitle(_title);

		return `${title}\n${description}`;
	} catch (error) {
		console.error(error);

		return null;
	}
};

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

interface CreateStatementFromModalParams {
	title: string;
	description: string;
	isOptionSelected: boolean;
	parentStatement: Statement | 'top';
	toggleAskNotifications?: VoidFunction;
	isSendToStoreTemp?: boolean;
}

export async function createStatementFromModal({
	title,
	description,
	isOptionSelected,
	toggleAskNotifications,
	parentStatement,
	isSendToStoreTemp,
}: CreateStatementFromModalParams) {
	try {
		if (!title) throw new Error('title is undefined');

		const _title = prefixTitle(title);
		const text = `${_title}\n${description}`;

		const newStatement = createStatement({
			...defaultStatementSettings,
			hasChildren: true,
			toggleAskNotifications,
			text,
			parentStatement,
			statementType: isOptionSelected
				? StatementType.option
				: StatementType.question,
		});

		if (!newStatement) throw new Error('newStatement was not created');

		await setStatementToDB({
			statement: newStatement,
			parentStatement: parentStatement === 'top' ? undefined : parentStatement,
			addSubscription: true,
		});

		if (isSendToStoreTemp) {
			//dispatch to the store
			store.dispatch(setTempStatementsForPresentation([newStatement]));
		}
	} catch (error) {
		console.error(error);
	}
}
