import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'


// Define a type for the slice state
interface AccessibiliyState {
    fontSize: number;
}


// Define the initial state using that type
const initialState: AccessibiliyState = {
    fontSize: 14,
}

export const accessibilitySlicer = createSlice({
    name: 'accessibility',
    initialState,
    reducers: {
        increaseFontSize: (state, action: PayloadAction<number>) => {
            try {
               
                state.fontSize += action.payload;
                if(state.fontSize <10) state.fontSize = 10;
                if(state.fontSize >30) state.fontSize = 30;

            } catch (error) {
                console.error(error);
            }
        },
        setFontSize: (state, action: PayloadAction<number>) => {
            try {
                
                state.fontSize = action.payload;
                if(state.fontSize <10) state.fontSize = 10;
                if(state.fontSize >30) state.fontSize = 30;

            } catch (error) {
                console.error(error);
            }
        }

    },
})

export const { increaseFontSize,setFontSize } = accessibilitySlicer.actions

export const fontSizeSelector = (state: RootState) => state.accessibiliy.fontSize;


export default accessibilitySlicer.reducer