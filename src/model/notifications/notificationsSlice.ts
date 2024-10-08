import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {  NotificationType, updateArray } from "delib-npm";

// Define a type for the slice state
interface notificationsState {
	inAppNotifications: NotificationType[];
}


// Define the initial state using that type
const initialState: notificationsState = {
	inAppNotifications: []
};

export const notificationsSlicer = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		setInAppNotifications: (state, action: PayloadAction<NotificationType[]>) => {
			try {

				action.payload.forEach(notification => {
					state.inAppNotifications = updateArray(state.inAppNotifications, notification, "notificationId");
				});
			} catch (error) {
				console.error(error);
			}
		},
		setInAppNotification: (state, action: PayloadAction<NotificationType>) => {
			try {
				state.inAppNotifications = updateArray(state.inAppNotifications, action.payload, "notificationId");

			} catch (error) {
				console.error(error);
			}
		},
		deleteInAppNotification: (state, action: PayloadAction<string>) => {
			try {
				state.inAppNotifications = state.inAppNotifications.filter(notification => notification.notificationId !== action.payload);
			} catch (error) {
				console.error(error);
			}
		},
		deleteInAppNotificationsByParentId: (state, action: PayloadAction<string>) => {
			try {
				state.inAppNotifications = state.inAppNotifications.filter(notification => notification.parentId !== action.payload);
			} catch (error) {
				console.error(error);
			}
		},
		
	},
});

export const {
	setInAppNotification,
	setInAppNotifications,
	deleteInAppNotification,
	deleteInAppNotificationsByParentId
} = notificationsSlicer.actions;

// Other code such as selectors can use the imported `RootState` type
export const inAppNotificationsSelector = (state: RootState) => state.notifications.inAppNotifications;


export default notificationsSlicer.reducer;
