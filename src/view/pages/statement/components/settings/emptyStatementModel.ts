import { ResultsBy, Screen, Statement } from 'delib-npm';

export const defaultStatementSettings = {
	enhancedEvaluation: true,
	showEvaluation: true,
	enableAddVotingOption: true,
	enableAddEvaluationOption: true,
	subScreens: undefined,
	inVotingGetOnlyResults: false,
	enableSimilaritiesSearch: false,
} as const;

export const defaultResultsSettings = {
	resultsBy: ResultsBy.topOptions,
	numberOfResults: 1,
} as const;

export const defaultStatementSubScreens: Screen[] = [
	Screen.CHAT,
	Screen.OPTIONS,
	Screen.VOTE,
] as const;

export const defaultEmptyStatement: Statement = {
	statement: '',
	statementId: '',
	parentId: '',
	creatorId: '',
	creator: {
		displayName: '',
		uid: '',
		defaultLanguage: undefined,
		email: undefined,
		photoURL: undefined,
		isAnonymous: undefined,
		fontSize: undefined,
		color: undefined,
		agreement: undefined,
		role: undefined,
	},
	lastUpdate: 0,
	createdAt: 0,
	consensus: 0,
	topParentId: "",

	// default values
	subScreens: defaultStatementSubScreens,
	resultsSettings: defaultResultsSettings,
	statementSettings: defaultStatementSettings,
	hasChildren: true,
} as const;
