
import { createSlice } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import {Results} from "delib-npm";



// Define a type for the slice state
interface ResultsState {
    results: Results[];
}

// Define the initial state using that type
const initialState: ResultsState = {
    results: []
}

export const resultsSlice = createSlice({
    name: 'results',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setResults: () => {
            try {
            //     const result:Results = action.payload;
            //    const resultStore = state.results.find(result => result.statementId === action.payload.statementId);
            //    if(!resultStore){
            //          state.results.push(action.payload);
            //          return;
            //    }
                // const keys:string[] = Object.keys(result);
                // keys.forEach((key:string) => {
                //     if (key !== "statementId") {
                //         resultStore[key] = result[key];
                //     }
                // })
            } catch (error) {
                console.error(error);
            }
        }
    },
})

export const { setResults } = resultsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const resultSelector = (statementId: string | undefined) => (state: RootState) => state.results.results.find(result => result.top.statementId === statementId);



