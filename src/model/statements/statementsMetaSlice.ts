import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { StatementMeta } from "delib-npm";
import { updateArray } from "../../controllers/general/helpers";



// Define a type for the slice state
interface StatementMetaState {
    statementsMeta: StatementMeta[];
}

// Define the initial state using that type
const initialState: StatementMetaState = {
    statementsMeta: [],
};

export const statementMeta = createSlice({
    name: "statements-meta",
    initialState,
    reducers: {
        setStatementMeta: (state, action: PayloadAction<StatementMeta>) => {
            try {

                const statementMeta = action.payload as StatementMeta;
                // StatementMetaSchema.parse(statementMeta);
                console.log(statementMeta)
                state.statementsMeta = updateArray(state.statementsMeta, statementMeta, "statementId");

            } catch (error) {
                console.error(error);
            }
        }
    },
});

export const {
    setStatementMeta
} = statementMeta.actions;

// Other code such as selectors can use the imported `RootState` type
export const statementMetaSelector = (statementId:string) => (state: RootState) => state.statementMeta.statementsMeta.find((statementMeta) => statementMeta.statementId === statementId);


export default statementMeta.reducer;
