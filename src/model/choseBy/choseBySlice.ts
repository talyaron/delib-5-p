import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChoseBy, updateArray } from 'delib-npm';

interface ChoseByState {
	statements: ChoseBy[];
}

const initialState: ChoseByState = {
	statements: [],
};

export const choseBySlice = createSlice({
	name: 'choseBy',
	initialState,
	reducers: {
		setChoseBy: (state, action: PayloadAction<ChoseBy>) => {
			state.statements = updateArray(state.statements, action.payload, "statementId");
		}
	},
});

export const { setChoseBy } = choseBySlice.actions;

export const choseBySelector = (statementId: string) => (state: { choseBys: ChoseByState }) => state.choseBys.statements.find((choseBy) => choseBy.statementId === statementId);

export default choseBySlice.reducer;