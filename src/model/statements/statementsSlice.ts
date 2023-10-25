import equal from 'fast-deep-equal';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Statement, StatementSchema, StatementSubscription, StatementSubscriptionSchema } from 'delib-npm';
import { updateArray } from '../../functions/general/helpers';
import { LobbyRooms, RoomAskToJoin } from 'delib-npm';
import { auth } from '../../functions/db/auth';


enum StatementScreen {
  chat = "chat",
  options = "options",
}

// Define a type for the slice state
interface StatementsState {
  statements: Statement[];
  statementSubscription: StatementSubscription[],
  screen: StatementScreen,
  askToJoinRooms: RoomAskToJoin[],
  lobbyRooms: LobbyRooms[]
}

interface StatementOrder {
  statementId: string,
  order: number
}

// Define the initial state using that type
const initialState: StatementsState = {
  statements: [],
  statementSubscription: [],
  screen: StatementScreen.chat,
  askToJoinRooms: [],
  lobbyRooms: []
}

export const statementsSlicer = createSlice({
  name: 'statements',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setStatement: (state, action: PayloadAction<Statement>) => {
      try {
        StatementSchema.parse(action.payload);
        const newStatement = action.payload;
        newStatement.order = 0;
        const oldStatement = state.statements.find(statement => statement.statementId === newStatement.statementId);
        const isEqualStatements = equal(oldStatement, newStatement);
        if (!isEqualStatements)
          state.statements = updateArray(state.statements, action.payload, "statementId");
      } catch (error) {
        console.error(error);
      }
    },
    setStatementSubscription: (state, action: PayloadAction<StatementSubscription>) => {
      try {

        StatementSubscriptionSchema.parse(action.payload);

        const newStatement = action.payload;
        const oldStatement = state.statements.find(statement => statement.statementId === newStatement.statementId);
        const isEqualStatements = equal(oldStatement, newStatement);
        if (!isEqualStatements)
          state.statementSubscription = updateArray(state.statementSubscription, action.payload, "statementsSubscribeId");
      } catch (error) {
        console.error(error);
      }
    },
    setStatementOrder: (state, action: PayloadAction<StatementOrder>) => {
      try {
        const { statementId, order } = action.payload;
        const statement = state.statements.find(statement => statement.statementId === statementId);
        if (statement)
          statement.order = order;


      } catch (error) {
        console.error(error);
      }
    },
    setStatementElementHight: (state, action: PayloadAction<{ statementId: string, height: number | undefined }>) => {
      try {
        const { statementId, height } = action.payload;
        const statement = state.statements.find(statement => statement.statementId === statementId);
        if (statement)
          statement.elementHight = height;
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
    setAskToJoinRooms: (state, action: PayloadAction<{ request: RoomAskToJoin | undefined, parentId: string }>) => {
      try {
       
        const { request, parentId } = action.payload;

        if (!request) {
          //remove preivous room request
      
          state.askToJoinRooms = state.askToJoinRooms.filter(room => room.parentId !== parentId);
          return;
        }
        //set request to join room
        state.askToJoinRooms = updateArray(state.askToJoinRooms, request, "requestId");


      } catch (error) {
        console.error(error);
      }
    },
    setLobbyRooms: (state, action: PayloadAction<{ lobbyRooms: LobbyRooms[] }>) => {
      try {
        const { lobbyRooms } = action.payload;
        lobbyRooms.forEach(lobbyRoom => {
          state.lobbyRooms = updateArray(state.lobbyRooms, lobbyRoom, "statementId");
        })

      } catch (error) {
        console.error(error);
      }
    },
  }
});

export const { setLobbyRooms, setAskToJoinRooms, setStatement, setStatementSubscription, setStatementOrder, setScreen, setStatementElementHight } = statementsSlicer.actions

// statements
export const screenSelector = (state: RootState) => state.statements.screen;
export const statementsSelector = (state: RootState) => state.statements.statements;
export const statementsRoomSolutions = (statementId: string | undefined) => (state: RootState) => state.statements.statements.filter(statement => statement.parentId === statementId && statement.type === "solution").sort((a, b) => a.createdAt - b.createdAt);
export const statementsSubscriptionsSelector = (state: RootState) => state.statements.statementSubscription;
export const statementSelector = (statementId: string | undefined) => (state: RootState) => state.statements.statements.find(statement => statement.statementId === statementId);
export const statementSubsSelector = (statementId: string | undefined) => (state: RootState) => state.statements.statements.filter(statementSub => statementSub.parentId === statementId).sort((a, b) => a.createdAt - b.createdAt);
export const statementNotificationSelector = (statementId: string | undefined) => (state: RootState) => state.statements.statementSubscription.find(statementSub => statementSub.statementId === statementId)?.notification || false;
export const statementSubscriptionSelector = (statementId: string | undefined) => (state: RootState) => state.statements.statementSubscription.find(statementSub => statementSub.statementId === statementId) || undefined;
export const statementOrderSelector = (statementId: string | undefined) => (state: RootState) => state.statements.statements.find(statement => statement.statementId === statementId)?.order || 0;
export const statementElementHightSelector = (statementId: string | undefined) => (state: RootState) => state.statements.statements.find(statement => statement.statementId === statementId)?.elementHight || 0;
//rooms
export const participantsSelector = (statementId: string | undefined) => (state: RootState) => state.statements.askToJoinRooms.filter(room => room.parentId === statementId);
export const askToJoinRoomsSelector = (state: RootState) => state.statements.askToJoinRooms;
export const askToJoinRoomSelector = (statementId: string | undefined) => (state: RootState) => state.statements.askToJoinRooms.find(room => room.statementId === statementId);
export const userSelectedRoomSelector =(statementId: string | undefined) => (state: RootState) => state.statements.askToJoinRooms.find(room => room.participant.uid === auth.currentUser?.uid && room.parentId === statementId);
export const topicParticipantsSelector = (statementId: string | undefined) => (state: RootState) => state.statements.askToJoinRooms.filter(room => room.statementId === statementId);
//find the user selected topic
export const userSelectedTopicSelector = (statementId: string | undefined) => (state: RootState) => state.statements.askToJoinRooms.find(room => room.participant.uid === auth.currentUser?.uid && room.parentId === statementId);
//loby rooms
export const lobbyRoomsSelector = (state: RootState) => state.statements.lobbyRooms;
export const lobbyRoomSelector = (statementId: string | undefined) => (state: RootState) => state.statements.lobbyRooms.find(room => room.statementId === statementId);

export default statementsSlicer.reducer