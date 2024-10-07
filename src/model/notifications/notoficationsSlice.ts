import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Agreement, NotificationType, User, UserSchema, UserSettings } from "delib-npm";
import { defaultFontSize } from "../fonts/fontsModel";



// Define a type for the slice state
interface notificationsState {
  inAppNotifications: NotificationType[];
}
 

// Define the initial state using that type
const initialState: notificationsState = {
	inAppNotifications: []
};

export const userSlicer = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		setNotification: (state, action: PayloadAction<NotificationType[]>) => {
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
		setColorContrast: (state, action: PayloadAction<boolean>) => {
			state.colorContrast = action.payload;
		},
		setUserSettings: (state, action: PayloadAction<UserSettings | null>) => {
			state.userSettings = action.payload;
		}
	},
});

export const {
	setUser,
	increaseFontSize,
	setFontSize,
	updateAgreementToStore,
	toggleColorContrast,
	setColorContrast,
	setUserSettings
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

export const userSettingsSelector = (state: RootState) =>
	state.user.userSettings;

export default userSlicer.reducer;
