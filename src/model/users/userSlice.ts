import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { User, UserSchema } from 'delib-npm';

export enum Status {
  idle = 'idle',
  loading = 'loading',
  failed = 'failed'
}

// Define a type for the slice state
interface UserState {
  user: User | null;
  status: Status;
  askToSubscribeToNotifications: {
    show: boolean;
  }
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
  askToSubscribeToNotifications:{
    show: false,
  },
  status: Status.idle
}

export const userSlicer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      try {
        if (action.payload){
        UserSchema.parse(action.payload);
        state.user = action.payload;
        } else {
          state.user = null;
        }
      } catch (error) {
        console.error(error);
      }
    },
    showAskNotifications: (state, action: PayloadAction<boolean>) => {
      state.askToSubscribeToNotifications.show = action.payload;
    }
  },
})

export const { setUser } = userSlicer.actions

// Other code such as selectors can use the imported `RootState` type
export const userSelector = (state: RootState) => state.user.user;
export const statusSelector = (state: RootState) => state.user.status;
export const askToSubscribeToNotificationsSelector = (state: RootState) => state.user.askToSubscribeToNotifications;

export default userSlicer.reducer