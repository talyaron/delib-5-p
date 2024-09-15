import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Agreement, User, UserSchema } from "delib-npm";
import { defaultFontSize } from "../fonts/fontsModel";

export enum Status {
    idle = "idle",
    loading = "loading",
    failed = "failed",
}

// Define a type for the slice state
interface UserState {
    user: User | null;
    status: Status;
    askToSubscribeToNotifications: {
        show: boolean;
    };
	colorContrast: boolean;
}

// Define the initial state using that type
const initialState: UserState = {
	user: null,
	askToSubscribeToNotifications: {
		show: false,
	},
	status: Status.idle,
	colorContrast: false,
};

export const userSlicer = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User | null>) => {
			try {
				if (action.payload) {
					const user = action.payload as User;
					if (
						!user.fontSize ||
                        typeof user.fontSize !== "number" ||
                        isNaN(user.fontSize)
					)
						user.fontSize = defaultFontSize;

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
		},
		increaseFontSize: (state, action: PayloadAction<number>) => {
			try {
				if (!state.user) return;
				if (!state.user?.fontSize) state.user.fontSize = defaultFontSize;

				state.user.fontSize += action.payload;
				if (state.user.fontSize < 10) state.user.fontSize = 10;
				if (state.user.fontSize > 30) state.user.fontSize = 30;
			} catch (error) {
				console.error(error);
			}
		},
		setFontSize: (state, action: PayloadAction<number>) => {
			try {
				if (!state.user) return;

				state.user.fontSize = action.payload;
				if (state.user.fontSize < 10) state.user.fontSize = 10;
				if (state.user.fontSize > 30) state.user.fontSize = 30;
			} catch (error) {
				console.error(error);
			}
		},
		updateAgreementToStore: (
			state: UserState,
			action: PayloadAction<Agreement | undefined>,
		) => {
			try {
				if (!state.user) return;

				if (!action.payload) {
					delete state.user.agreement;

					return;
				}

				const agreement = action.payload;
				state.user.agreement = agreement;
			} catch (error) {
				console.error(error);
			}
		},
		toggleColorContrast: (state) => {
			state.colorContrast = !state.colorContrast;
		},
	},
});

export const {
	setUser,
	increaseFontSize,
	setFontSize,
	updateAgreementToStore,
	toggleColorContrast,
} = userSlicer.actions;

// Other code such as selectors can use the imported `RootState` type
export const userSelector = (state: RootState) => state.user.user;
export const statusSelector = (state: RootState) => state.user.status;
export const askToSubscribeToNotificationsSelector = (state: RootState) =>
	state.user.askToSubscribeToNotifications;
export const fontSizeSelector = (state: RootState) =>
	state.user.user?.fontSize || defaultFontSize;
export const colorContrastSelector = (state: RootState) =>
	state.user.colorContrast;

export default userSlicer.reducer;
