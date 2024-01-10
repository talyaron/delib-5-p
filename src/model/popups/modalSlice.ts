import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

import { Statement, StatementType } from "delib-npm";

// Define a type for the slice state
export enum ModalIds {

    newStatement = "new-statement",
    newSubStatement = "new-sub-statement",
}

export interface ModalProps{
    modalId:ModalIds,
    isOpen:boolean,
    statementType?:StatementType,
    statement?:Statement | null,
    parentStatement?:Statement | null,
}

interface ModalState {
    modals: ModalProps[];
}

// Define the initial state using that type
const initialState: ModalState = {
    modals: [
        {
            modalId:ModalIds.newStatement,
            isOpen:false
        },
        {
            modalId:ModalIds.newSubStatement,
            isOpen:false
        }
    ],
};

export const modalSlicer = createSlice({
    name: "modals",
    initialState,
    reducers: {
        setModal: (state, action: PayloadAction<ModalProps>) => {
            try {
                const newModal = action.payload;
                
                const oldModalIndex = state.modals.findIndex(
                    (modal) => modal.modalId === newModal.modalId
                );
                if(oldModalIndex === -1) throw new Error("modal not found");

                state.modals[oldModalIndex] = newModal;
            } catch (error) {
                console.error(error);
            }
        },
        turnOnOffModal: (state, action: PayloadAction<ModalProps>) => {
           try {
            const newModal = action.payload;
                
                const oldModalIndex = state.modals.findIndex(
                    (modal) => modal.modalId === newModal.modalId
                );
                if(oldModalIndex === -1) throw new Error("modal not found");

                state.modals[oldModalIndex].isOpen = newModal.isOpen;
           } catch (error) {
            console.error(error);
           }
        },
    },
});

export const { setModal, turnOnOffModal } = modalSlicer.actions;

export const modalSelector = (modalId:ModalIds) => (state: RootState) => state.modal.modals.find((modal) => modal.modalId === modalId);



export default modalSlicer.reducer;
