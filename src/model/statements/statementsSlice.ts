/* eslint-disable indent */
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Third party imports

import {
	Screen,
	ScreenSchema,
	Statement,
	StatementSchema,
	StatementSubscription,
	StatementSubscriptionSchema,
	StatementType,
	isOptionFn,
} from "delib-npm";

import { ZodError, z } from "zod";

// Helpers
import { updateArray, writeZodError } from "../../controllers/general/helpers";
import { sortSubStatements } from "../../view/pages/statement/components/solutions/statementSolutionsCont";

enum StatementScreen {
	chat = "chat",
	options = "options",
}

// Define a type for the slice state
interface StatementsState {
	statements: Statement[];
	statementSubscription: StatementSubscription[];
	statementSubscriptionLastUpdate: number;
	statementMembership: StatementSubscription[];
	screen: StatementScreen;
}

interface StatementOrder {
	statementId: string;
	order: number;
}

// Define the initial state using that type
const initialState: StatementsState = {
	statements: [],
	statementSubscription: [],
	statementSubscriptionLastUpdate: 0,
	statementMembership: [],
	screen: StatementScreen.chat,
};

export const statementsSlicer = createSlice({
	name: "statements",
	initialState,
	reducers: {
		setStatement: (state, action: PayloadAction<Statement>) => {
			try {
				const newStatement = { ...action.payload };

				const results = StatementSchema.safeParse(newStatement);
				if (!results.success) {
					const error = results.error as ZodError; // Type assertion for clarity
					writeZodError(error, newStatement);
					throw new Error("statement not valid on setStatement");
				}

				//for legacy statements - can be deleted after all statements are updated or at least after 1 feb 24.
				if (!Array.isArray(newStatement.results))
					newStatement.results = [];

				newStatement.order = 0;
				const oldStatement = state.statements.find(
					(statement) =>
						statement.statementId === newStatement.statementId,
				);

				const isEqualStatements =
					JSON.stringify(oldStatement) ===
					JSON.stringify(newStatement);
				if (!isEqualStatements)
					state.statements = updateArray(
						state.statements,
						action.payload,
						"statementId",
					);

				//update last update if bigger than current
				if (
					newStatement.lastUpdate >
					state.statementSubscriptionLastUpdate
				) {
					state.statementSubscriptionLastUpdate =
						newStatement.lastUpdate;
				}
			} catch (error) {
				console.error(error);
			}
		},
		setStatements: (state, action: PayloadAction<Statement[]>) => {
			try {
				const statements = action.payload;

				const { success } = z
					.array(StatementSchema)
					.safeParse(statements);
				if (!success) {
					console.error("statements not valid on setStatements");
				}

				statements.forEach((statement) => {
					state.statements = updateArray(
						state.statements,
						statement,
						"statementId",
					);
				});
			} catch (error) {
				console.error(error);
			}
		},
		deleteStatement: (state, action: PayloadAction<string>) => {
			try {
				const statementId = action.payload;

				state.statements = state.statements.filter(
					(statement) => statement.statementId !== statementId,
				);
			} catch (error) {
				console.error(error);
			}
		},
		setStatementSubscription: (
			state,
			action: PayloadAction<StatementSubscription>,
		) => {
			try {
				const newStatementSubscription = action.payload;
				const oldStatementSubscription = state.statements.find(
					(statement) =>
						statement.statementId === newStatementSubscription.statementId,
				);
				const isEqualStatements =
					JSON.stringify(oldStatementSubscription) ===
					JSON.stringify(newStatementSubscription);
				if (!isEqualStatements)
					state.statementSubscription = updateArray(
						state.statementSubscription,
						action.payload,
						"statementsSubscribeId",
					);
				state.statementSubscription = updateArray(
					state.statementSubscription,
					newStatementSubscription,
					"statementId",
				);

				//update last update if bigger than current
				if (
					newStatementSubscription.lastUpdate >
					state.statementSubscriptionLastUpdate
				) {
					state.statementSubscriptionLastUpdate =
					newStatementSubscription.lastUpdate;
				}
			} catch (error) {
				console.error(error);
			}
		},
		setStatementsSubscription: (
			state,
			action: PayloadAction<StatementSubscription[]>,
		) => {
			try {
				const newStatements = action.payload;

				//TODO: remove this after all statements are updated at about 4 April 2024
				// z.array(StatementSubscriptionSchema).parse(newStatements);

				newStatements.forEach((statement) => {
					state.statementSubscription = updateArray(
						state.statementSubscription,
						statement,
						"statementsSubscribeId",
					);
				});
			} catch (error) {
				console.error(error);
			}
		},
		deleteSubscribedStatement: (state, action: PayloadAction<string>) => {
			try {
				const statementId = action.payload;

				state.statementSubscription =
					state.statementSubscription.filter(
						(statement) => statement.statementId !== statementId,
					);
			} catch (error) {
				console.error(error);
			}
		},
		setStatementOrder: (state, action: PayloadAction<StatementOrder>) => {
			try {
				const { statementId, order } = action.payload;
				const statement = state.statements.find(
					(statement) => statement.statementId === statementId,
				);
				if (statement) statement.order = order;
			} catch (error) {
				console.error(error);
			}
		},
		setStatementElementHight: (
			state,
			action: PayloadAction<{
				statementId: string;
				height: number | undefined;
			}>,
		) => {
			try {
				const { statementId, height } = action.payload;
				const statement = state.statements.find(
					(statement) => statement.statementId === statementId,
				);
				if (statement) statement.elementHight = height;
			} catch (error) {
				console.error(error);
			}
		},
		setTempStatementsForPresentation: (state, action: PayloadAction<Statement[]>) => {
			try {
				const statements = action.payload;

				const results = z
					.array(StatementSchema)
					.safeParse(statements);
				if (!results.success) {
					writeZodError(results.error, statements);
				}

				//clear all temp statements
				state.statements.forEach((statement) => {
					statement.isPartOfTempPresentation = false;
				});

				//set new temp statements
				statements.forEach((statement) => {
					statement.isPartOfTempPresentation = true;
					state.statements = updateArray(
						state.statements,
						statement,
						"statementId",
					);
				});
			} catch (error) {
				console.error(error);
			}
		},
		setScreen: (state, action: PayloadAction<StatementScreen>) => {
			try {
				state.screen = action.payload;
			} catch (error) {
				console.error(error);
			}
		},
		toggleSubscreen: (
			state,
			action: PayloadAction<{ statement: Statement; screen: Screen }>,
		) => {
			try {
				ScreenSchema.parse(action.payload.screen);
				StatementSchema.parse(action.payload.statement);
				const { statement, screen } = action.payload;
				const _statement = state.statements.find(
					(st) => st.statementId === statement.statementId,
				);
				if (!_statement) throw new Error("statement not found");
				const subScreens = _statement?.subScreens;
				if (subScreens?.length === 0 || subScreens === undefined)
					throw new Error("no subscreens");
				if (subScreens.includes(screen)) {
					_statement.subScreens = subScreens.filter(
						(subScreen) => subScreen !== screen,
					);
				} else {
					_statement.subScreens = [...subScreens, screen];
				}
			} catch (error) {
				console.error(error);
			}
		},

		setMembership: (
			state,
			action: PayloadAction<StatementSubscription>,
		) => {
			try {
				const newMembership = action.payload;

				const { success } =
					StatementSubscriptionSchema.safeParse(newMembership);

				if (!success) {
					console.error(
						"statement subscription not valid in set membership.",
					);
				}
				state.statementMembership = updateArray(
					state.statementMembership,
					newMembership,
					"statementsSubscribeId",
				);
			} catch (error) {
				console.error(error);
			}
		},
		removeMembership: (state, action: PayloadAction<string>) => {
			try {
				const statementsSubscribeId = action.payload;
				state.statementMembership = state.statementMembership.filter(
					(statement) =>
						statement.statementsSubscribeId !==
						statementsSubscribeId,
				);
			} catch (error) {
				console.error(error);
			}
		},
		resetStatements: (state) => {
			state.statements = [];
			state.statementSubscription = [];
			state.statementSubscriptionLastUpdate = 0;
			state.statementMembership = [];
			state.screen = StatementScreen.chat;
		},
	},
});

export const {
	setStatement,
	setStatements,
	setStatementSubscription,
	setStatementsSubscription,
	setTempStatementsForPresentation,
	deleteStatement,
	deleteSubscribedStatement,
	setStatementOrder,
	setScreen,
	toggleSubscreen,
	setStatementElementHight,
	setMembership,
	removeMembership,
	resetStatements,
} = statementsSlicer.actions;

// statements
export const totalMessageBoxesSelector = (state: RootState) => state.statements.statements.length;


export const screenSelector = (state: RootState) => state.statements.screen;

export const statementSelectorById = (statementId: string) => (state: RootState) => {
	return state.statements.statements.find((statement) => statement.statementId === statementId);

}

export const statementsSelector = (state: RootState) =>
	state.statements.statements;

export const statementsChildSelector =
	(statementId: string) => (state: RootState) =>
		state.statements.statements.filter((statement) =>
			statement.parents?.includes(statementId),
		);
export const statementsRoomSolutions =
	(statementId: string | undefined) => (state: RootState) =>
		state.statements.statements
			.filter(
				(statement) =>
					statement.parentId === statementId &&
					statement.statementType === StatementType.result,
			)
			.sort((a, b) => a.createdAt - b.createdAt);
export const statementsSubscriptionsSelector = (
	state: RootState,
): StatementSubscription[] => state.statements.statementSubscription;
export const statementSelector =
	(statementId: string | undefined) => (state: RootState) =>
		state.statements.statements.find(
			(statement) => statement.statementId === statementId,
		);
export const statementSubsSelector =
	(statementId: string | undefined) => (state: RootState) =>
		state.statements.statements
			.filter((statementSub) => statementSub.parentId === statementId)
			.sort((a, b) => a.createdAt - b.createdAt)
			.map((statement) => ({ ...statement }));

export const statementOptionsSelector =
	(statementId: string | undefined) => (state: RootState) => {
		const subStatements = state.statements.statements
			.filter(
				(statementSub) =>
					statementSub.parentId === statementId &&
					isOptionFn(statementSub),
			)
			.sort((a, b) => a.createdAt - b.createdAt)
			.map((statement) => ({ ...statement }));

		const sortedSubStatements = sortSubStatements(subStatements, state.statements.screen);
		
		return sortedSubStatements;
	};

export const questionsSelector = (statementId: string | undefined) => (state: RootState) => state.statements.statements.filter((statement) => statement.parentId === statementId && statement.statementType === StatementType.question).sort((a, b) => a.createdAt - b.createdAt);

const selectedStatementId = (statementId: string | undefined) => statementId;

const slctSts = (state: RootState) => state.statements.statements;

export const statementSubsSelectorMemo = createSelector(
	[selectedStatementId, slctSts],
	(statementId, statements) => {
		if (!statementId) return [];
		const sts = statements
			.filter((statementSub) => statementSub.parentId === statementId)
			.sort((a, b) => a.createdAt - b.createdAt)
			.map((statement) => ({ ...statement }));

		return sts;
	},
);

export const statementNotificationSelector =
	(statementId: string | undefined) => (state: RootState) =>
		state.statements.statementSubscription.find(
			(statementSub) => statementSub.statementId === statementId,
		)?.notification || false;
export const statementSubscriptionSelector =
	(statementId: string | undefined) => (state: RootState) =>
		state.statements.statementSubscription.find(
			(statementSub) => statementSub.statementId === statementId,
		) || undefined;
export const statementOrderSelector =
	(statementId: string | undefined) => (state: RootState) =>
		state.statements.statements.find(
			(statement) => statement.statementId === statementId,
		)?.order || 0;
export const statementElementHightSelector =
	(statementId: string | undefined) => (state: RootState) =>
		state.statements.statements.find(
			(statement) => statement.statementId === statementId,
		)?.elementHight || 0;
export const lastUpdateStatementSubscriptionSelector = (state: RootState) =>
	state.statements.statementSubscriptionLastUpdate;

// Membership
export const statementMembershipSelector =
	(statementId: string | undefined) => (state: RootState) =>
		state.statements.statementMembership.filter(
			(statement: StatementSubscription) =>
				statement.statementId === statementId,
		);

export const hasTokenSelector =
	(token: string, statementId: string) => (state: RootState) => {
		const statement = state.statements.statementSubscription.find(
			(statement) => statement.statementId === statementId,
		);

		return statement?.token?.includes(token) || false;
	};

	export const subscriptionParentStatementSelector = (parentId: string) => (state: RootState) => {
		return state.statements.statementSubscription.filter((sub) => sub.statement.topParentId === parentId);
	}

export default statementsSlicer.reducer;
