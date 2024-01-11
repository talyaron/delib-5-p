import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Third party imports

import {
    LobbyRooms,
    RoomAskToJoin,
    Statement,
    StatementSchema,
    StatementSubscription,
    StatementSubscriptionSchema,
    StatementType,
} from "delib-npm";

import { z } from "zod";

// Helpers
import { updateArray } from "../../functions/general/helpers";

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
    askToJoinRooms: RoomAskToJoin[];
    lobbyRooms: LobbyRooms[];
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
    askToJoinRooms: [],
    lobbyRooms: [],
};

export const statementsSlicer = createSlice({
    name: "statements",
    initialState,
    reducers: {
        setStatement: (state, action: PayloadAction<Statement>) => {
            try {
                const newStatement = { ...action.payload };
                const { success } = StatementSchema.safeParse(newStatement);
                if (!success) {
                    console.error("statement not valid on setStatement");
                  
                }
                //for legacy statements - can be deleted after all statements are updated or at least after 1 feb 24.
                if (!Array.isArray(newStatement.results))
                    newStatement.results = [];

                StatementSchema.parse(newStatement);
                newStatement.order = 0;
                const oldStatement = state.statements.find(
                    (statement) =>
                        statement.statementId === newStatement.statementId
                );

                const isEqualStatements =
                    JSON.stringify(oldStatement) ===
                    JSON.stringify(newStatement);
                if (!isEqualStatements)
                    state.statements = updateArray(
                        state.statements,
                        action.payload,
                        "statementId"
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
                //for legacy statements - can be deleted after all statements are updated or at least after 1 feb 24.
                statements.forEach((statement) => {
                    if (!Array.isArray(statement.results))
                        statement.results = [];
                });

                const { success } = z
                    .array(StatementSchema)
                    .safeParse(statements);
                if (!success) {
                    console.error("statements not valid on setStatements");
                    
                }

                statements.forEach((statement) => {
                    updateArray(state.statements, statement, "statementId");
                });
            } catch (error) {
                console.error(error);
            }
        },
        deleteStatement: (state, action: PayloadAction<string>) => {
            try {
                const statementId = action.payload;

                state.statements = state.statements.filter(
                    (statement) => statement.statementId !== statementId
                );
            } catch (error) {
                console.error(error);
            }
        },
        setStatementSubscription: (
            state,
            action: PayloadAction<StatementSubscription>
        ) => {
            try {
                const { success } = StatementSubscriptionSchema.safeParse(
                    action.payload
                );
                if (!success) {
                    console.error("statement subscription not valid");
                 
                }

                const newStatement = action.payload;
                const oldStatement = state.statements.find(
                    (statement) =>
                        statement.statementId === newStatement.statementId
                );
                const isEqualStatements =
                    JSON.stringify(oldStatement) ===
                    JSON.stringify(newStatement);
                if (!isEqualStatements)
                    state.statementSubscription = updateArray(
                        state.statementSubscription,
                        action.payload,
                        "statementsSubscribeId"
                    );
                state.statements = updateArray(
                    state.statements,
                    newStatement.statement,
                    "statementId"
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
        deleteSubscribedStatement: (state, action: PayloadAction<string>) => {
            try {
                const statementId = action.payload;

                state.statementSubscription =
                    state.statementSubscription.filter(
                        (statement) => statement.statementId !== statementId
                    );
            } catch (error) {
                console.error(error);
            }
        },
        setStatementOrder: (state, action: PayloadAction<StatementOrder>) => {
            try {
                const { statementId, order } = action.payload;
                const statement = state.statements.find(
                    (statement) => statement.statementId === statementId
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
            }>
        ) => {
            try {
                const { statementId, height } = action.payload;
                const statement = state.statements.find(
                    (statement) => statement.statementId === statementId
                );
                if (statement) statement.elementHight = height;
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
        setAskToJoinRooms: (
            state,
            action: PayloadAction<{
                request: RoomAskToJoin | undefined;
                parentId: string;
            }>
        ) => {
            try {
                const { request, parentId } = action.payload;

                if (!request) {
                    //remove preivous room request

                    state.askToJoinRooms = state.askToJoinRooms.filter(
                        (room) => room.parentId !== parentId
                    );
                    return;
                }
                //set request to join room
                state.askToJoinRooms = updateArray(
                    state.askToJoinRooms,
                    request,
                    "requestId"
                );
            } catch (error) {
                console.error(error);
            }
        },
        setRoomRequests: (state, action: PayloadAction<RoomAskToJoin[]>) => {
            try {
                const requests = action.payload;
                z.array(z.any()).parse(requests);

                state.askToJoinRooms = requests;
            } catch (error) {
                console.error(error);
            }
        },
        removeFromAskToJoinRooms: (state, action: PayloadAction<string>) => {
            try {
                const requestId = action.payload;
                state.askToJoinRooms = state.askToJoinRooms.filter(
                    (room) => room.requestId !== requestId
                );
            } catch (error) {
                console.error(error);
            }
        },
        setMembership: (
            state,
            action: PayloadAction<StatementSubscription>
        ) => {
            try {
                const newMembership = action.payload;
                StatementSubscriptionSchema.parse(newMembership);
                state.statementMembership = updateArray(
                    state.statementMembership,
                    newMembership,
                    "statementsSubscribeId"
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
                        statementsSubscribeId
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
            state.askToJoinRooms = [];
            state.lobbyRooms = [];
        },
    },
});

export const {
    setRoomRequests,
    removeFromAskToJoinRooms,
    setAskToJoinRooms,
    setStatement,
    setStatements,
    deleteStatement,
    deleteSubscribedStatement,
    setStatementSubscription,
    setStatementOrder,
    setScreen,
    setStatementElementHight,
    setMembership,
    removeMembership,
    resetStatements,
} = statementsSlicer.actions;

// statements
export const screenSelector = (state: RootState) => state.statements.screen;
export const statementsSelector = (state: RootState) =>
    state.statements.statements;

export const statementsChildSelector =
    (statementId: string) => (state: RootState) =>
        state.statements.statements.filter((statement) =>
            statement.parents?.includes(statementId)
        );
export const statementsRoomSolutions =
    (statementId: string | undefined) => (state: RootState) =>
        state.statements.statements
            .filter(
                (statement) =>
                    statement.parentId === statementId &&
                    statement.statementType === StatementType.result
            )
            .sort((a, b) => a.createdAt - b.createdAt);
export const statementsSubscriptionsSelector = (state: RootState) =>
    state.statements.statementSubscription;
export const statementSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.statements.statements.find(
            (statement) => statement.statementId === statementId
        );
export const statementSubsSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.statements.statements
            .filter((statementSub) => statementSub.parentId === statementId)
            .sort((a, b) => a.createdAt - b.createdAt)
            .map((statement) => ({ ...statement }));

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
    }
);

// export const statementSubsSelectorMemo = createSelector(
//     statementsSelector,
//     (statementId: string | undefined) => statementId,
//     (statements, statementId) =>
//         statements
//             .filter((statementSub) => statementSub.parentId === statementId)
//             .sort((a, b) => a.createdAt - b.createdAt)
//             .map((statement) => ({ ...statement }))
// );

// export const statementSubsSelectorMemo = createSelector(
//     (state: RootState, statementId: string | undefined) => statementId,
//     (state: RootState) => state.statements.statements,
//     (statementId, statements) => {
//         return statements
//             .filter((statementSub) => statementSub.parentId === statementId)
//             .sort((a, b) => a.createdAt - b.createdAt)
//             .map((statement) => ({ ...statement }));
//     }
// );

// export const statementSubsSelectorMemo = createSelector(
//     (statementId: string | undefined) => (state: RootState) =>
//         state.statements.statements
//             .filter((statementSub) => statementSub.parentId === statementId)
//             .sort((a, b) => a.createdAt - b.createdAt)
//             .map((statement) => ({ ...statement })),
//     (statements) => statements
// );
export const statementNotificationSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.statements.statementSubscription.find(
            (statementSub) => statementSub.statementId === statementId
        )?.notification || false;
export const statementSubscriptionSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.statements.statementSubscription.find(
            (statementSub) => statementSub.statementId === statementId
        ) || undefined;
export const statementOrderSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.statements.statements.find(
            (statement) => statement.statementId === statementId
        )?.order || 0;
export const statementElementHightSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.statements.statements.find(
            (statement) => statement.statementId === statementId
        )?.elementHight || 0;
export const lastUpdateStatementSubscriptionSelector = (state: RootState) =>
    state.statements.statementSubscriptionLastUpdate;
//rooms
export const participantsSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.statements.askToJoinRooms.filter(
            (room) => room.parentId === statementId
        );
export const askToJoinRoomsSelector = (state: RootState) =>
    state.statements.askToJoinRooms;
export const askToJoinRoomSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.statements.askToJoinRooms.find(
            (room) => room.statementId === statementId
        );
export const userSelectedRoomSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.statements.askToJoinRooms.find(
            (room) =>
                room.participant.uid === state.user.user?.uid &&
                room.parentId === statementId
        );
export const topicParticipantsSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.statements.askToJoinRooms.filter(
            (room) => room.statementId === statementId
        );

//find the user selected topic
export const userSelectedTopicSelector =
    (parentId: string | undefined) => (state: RootState) =>
        state.statements.askToJoinRooms.find(
            (room) =>
                room.participant.uid === state.user.user?.uid &&
                room.parentId === parentId
        );
//loby rooms
export const lobbyRoomsSelector = (state: RootState) =>
    state.statements.lobbyRooms;
export const lobbyRoomSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.statements.lobbyRooms.find(
            (room) => room.statementId === statementId
        );
//membeship
export const statementMembershipSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.statements.statementMembership.filter(
            (statement: StatementSubscription) =>
                statement.statementId === statementId
        );

export default statementsSlicer.reducer;
