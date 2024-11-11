import {
	Statement,
	Collections,
	StatementSubscription,
	NotificationType,
} from 'delib-npm';
import {
	collection,
	doc,
	getDoc,
	onSnapshot,
	query,
	setDoc,
	Timestamp,
	Unsubscribe,
	where,
	orderBy,
	getDocs,
	writeBatch,
} from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging, FireStore } from '../config';
import { getUserFromFirebase } from '../users/usersGeneral';
import { vapidKey } from '../configKey';
import logo from '@/assets/logo/logo-96px.png';
import { store } from '@/model/store';
import {
	deleteInAppNotification,
	setInAppNotification,
} from '@/model/notifications/notificationsSlice';

export async function getUserPermissionToNotifications(
	t: (text: string) => string
): Promise<boolean> {
	try {
		if (!window.hasOwnProperty('Notification'))
			throw new Error('Notification not supported');
		if (Notification.permission === 'granted') return true;

		if (Notification.permission === 'denied') return false;

		//in case the user didn't set the notification permission yet
		alert(
			t(
				'Please confirm notifications to receive updates on new comments\nYou can disable notifications at any time'
			)
		);
		const permission = await Notification.requestPermission();

		if (permission !== 'granted') throw new Error('Permission not granted');

		return true;
	} catch (error) {
		return false;
	}
}

export async function onLocalMessage() {
	try {
		const msg = await messaging();
		if (!msg) throw new Error('msg is undefined');

		return onMessage(msg, (payload) => {
			if (payload.data?.creatorId === getUserFromFirebase()?.uid) return;

			Notification.requestPermission().then((permission) => {
				if (permission === 'granted') {
					const title = payload.data?.title || 'Delib';

					const notification = new Notification(title, {
						body: payload.data?.body || '',
						data: { url: payload.data?.url || '' },
						icon: logo,
					});

					const notificationSound = new Audio(
						'https://delib-5.web.app/assets/sound/sweet_notification.mp3'
					);

					notificationSound.autoplay = true;
					notificationSound.volume = 0.3;

					notificationSound.play();

					notification.onclick = (event) => {
						const target = event.target as Notification;

						const url = target.data.url;

						// window.open(url, "_blank");
						window.open(url, '_self');
					};
				} else {
					console.error('Unable to get permission to notify.');
				}
			});
		});
	} catch (error) {
		console.error(error);
	}
}

export async function setStatementSubscriptionNotificationToDB(
	statement: Statement | undefined,
	notification = true
) {
	try {
		const msg = await messaging();
		if (!msg) throw new Error('Notifications not supported');
		const token = await getToken(msg, { vapidKey });
		if (!token)
			throw new Error(
				'Token is undefined in setStatementSubscriptionNotificationToDB.'
			);

		if (!statement) throw new Error('Statement is undefined');
		const { statementId } = statement;

		const user = getUserFromFirebase();
		if (!user) throw new Error('User not logged in');
		if (!user.uid) throw new Error('User not logged in');

		const statementsSubscribeId = `${user.uid}--${statementId}`;
		const statementsSubscribeRef = doc(
			FireStore,
			Collections.statementsSubscribe,
			statementsSubscribeId
		);
		const statementSubscriptionDB = await getDoc(statementsSubscribeRef);

		if (!statementSubscriptionDB.exists()) {
			//set new subscription
			const tokenArr = [token];

			await setDoc(
				statementsSubscribeRef,
				{
					user,
					userId: user.uid,
					statementId,
					token: tokenArr,
					notification,
					lastUpdate: Timestamp.now().toMillis(),
					statementsSubscribeId,
					statement,
				},
				{ merge: true }
			);
		} else {
			// update subscription -> Remove notifications
			const statementSubscription =
				statementSubscriptionDB.data() as StatementSubscription;

			// StatementSubscriptionSchema.parse(statementSubscription);

			const tokenArr = statementSubscription.token
				? [...statementSubscription.token]
				: [];

			// If token is already in the array, remove it, otherwise add it
			if (!tokenArr.includes(token)) {
				tokenArr.push(token);
			} else {
				tokenArr.splice(tokenArr.indexOf(token), 1);
			}

			await setDoc(
				statementsSubscribeRef,
				{
					token: tokenArr,
					notification,
				},
				{ merge: true }
			);
		}
	} catch (error) {
		console.error(error);
	}
}

export function listenToInAppNotifications(): Unsubscribe {
	try {
		const user = store.getState().user.user;
		if (!user)
			return () => {
				return;
			};

		const dispatch = store.dispatch;

		const messagesRef = collection(FireStore, Collections.inAppNotifications);
		const q = query(
			messagesRef,
			where('userId', '==', user.uid),
			where('read', '==', false),
			orderBy('createdAt', 'desc')
		);

		return onSnapshot(q, (messagesDB) => {
			messagesDB.docChanges().forEach((change) => {
				if (change.type === 'added' || change.type === 'modified') {
					const message = change.doc.data() as NotificationType;
					dispatch(setInAppNotification(message));
				} else if (change.type === 'removed') {
					dispatch(deleteInAppNotification(change.doc.id));
				}
			});
		});
	} catch (error) {
		console.error(error);

		return () => {
			return;
		};
	}
}

export async function updateNotificationRead(
	notificationId: string,
	parentId?: string
) {
	try {
		const user = store.getState().user.user;
		if (!user) return;

		const notificationRef = doc(
			FireStore,
			Collections.inAppNotifications,
			notificationId
		);
		setDoc(notificationRef, { read: true }, { merge: true });

		//set all notifications of this parent to read
		if (!parentId) return;
		const notificationsRef = collection(
			FireStore,
			Collections.inAppNotifications
		);
		const q = query(
			notificationsRef,
			where('userId', '==', user.uid),
			where('parentId', '==', parentId)
		);
		const allParentNotificationsDB = await getDocs(q);

		const batch = writeBatch(FireStore);
		allParentNotificationsDB.forEach((doc) => {
			batch.set(doc.ref, { read: true }, { merge: true });
		});
		await batch.commit();
	} catch (error) {
		console.error(error);
	}
}
