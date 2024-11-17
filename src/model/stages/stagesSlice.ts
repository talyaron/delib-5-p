import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Stage, updateArray } from 'delib-npm';
import { RootState } from '../store';
import { createSelector } from '@reduxjs/toolkit';

interface StageState {
    stages: Stage[];
}

const initialState: StageState = {
    stages: [],
};

export const stagesSlice = createSlice({
    name: 'stages',
    initialState,
    reducers: {
        setStage(state, action: PayloadAction<Stage>) {
            state.stages = updateArray(state.stages, action.payload, "stageId");
        },
        removeStageByStageId(state, action: PayloadAction<string>) {
            const index = state.stages.findIndex(stage => stage.stageId === action.payload);
            if (index !== -1) {
                state.stages.splice(index, 1);
            }
        },
        resetStages(state) {
            state.stages = [];
        },
    },
});

export const { setStage, removeStageByStageId, resetStages } = stagesSlice.actions;

export const stageSelector = (stageId: string) => (state: RootState) => {
    return state.stages.stages.find(stage => stage.stageId === stageId);
}

export const statementStagesSelector = (statementId: string|undefined) => createSelector(
    (state: RootState) => state.stages.stages,
    (stages) => stages.filter(stage => stage.statementId === statementId)
);

export const stageByShortIdSelector = (statementId: string|undefined, shortId: string|undefined) => createSelector(
    (state: RootState) => state.stages.stages,
    (stages) => stages.find(stage => stage.shortId.toString() === shortId && stage.statementId === statementId)
);

export default stagesSlice.reducer;