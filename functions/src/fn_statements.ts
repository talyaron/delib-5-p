import { Collections, NotificationType, Statement } from 'delib-npm';
import { logger } from 'firebase-functions';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { db } from './index';

export async function updateSubscribedListenersCB(event: any) {
	//get statement
	const { statementId } = event.params;

	//get all subscribers to this statement
	const subscribersRef = db.collection(Collections.statementsSubscribe);
	const q = subscribersRef.where('statementId', '==', statementId);
	const subscribersDB = await q.get();

	//update all subscribers
	subscribersDB.docs.forEach((doc: any) => {
		try {
			const subscriberId = doc.data().statementsSubscribeId;
			if (!subscriberId) throw new Error('subscriberId not found');

			db.doc(`statementsSubscribe/${subscriberId}`).set(
				{
					lastUpdate: Timestamp.now().toMillis(),
				},
				{ merge: true }
			);
		} catch (error) {
			logger.error('error updating subscribers', error);
		}
	});

	return;
}

export async function updateParentWithNewMessageCB(e: any) {
	try {
		//get parentId
		const _statement = e.data.data() as Statement;
		const { parentId, topParentId, statementId, statement } = _statement;

		if (parentId === 'top') return;

		if (!parentId) throw new Error('parentId not found');

		//get parent
		const parentRef = db.doc(`${Collections.statements}/${parentId}`);
		// const parentDB = await parentRef.get();
		// const parent = parentDB.data();
		// if (!parent) throw new Error('parent not found');

		await setInAppNotifications(parentId, _statement);

		//update parent
		const lastMessage = statement;
		const lastUpdate = Timestamp.now().toMillis();
		parentRef.update({
			lastMessage,
			lastUpdate,
			totalSubStatements: FieldValue.increment(1),
		});

		//update topParent
		if (!topParentId) throw new Error('topParentId not found');
		if (topParentId === 'top')
			throw new Error(
				'topParentId is top, and it is an error in the client logic'
			);

		const topParentRef = db.doc(`statements/${topParentId}`);
		topParentRef.update({ lastChildUpdate: lastUpdate, lastUpdate });

		//create statement metadata
		const statementMetaRef = db.doc(
			`${Collections.statementsMetaData}/${statementId}`
		);
		await statementMetaRef.set({ statementId }, { merge: true });

		return;
	} catch (error) {
		logger.error(error);

		return;
	}
}


async function setInAppNotifications(parentId: string, statement: Statement) {
	try {
		const { creatorId } = statement;

		const parentRef = db.doc(`${Collections.statements}/${parentId}`);
		const parentDB = await parentRef.get();
		if(!parentDB.exists) throw new Error('parent not found');
		const parent = parentDB.data() as Statement;

		//get subscribers of parent
		const subscribersRef = db.collection(Collections.statementsSubscribe);
		const q = subscribersRef.where('statementId', '==', parentId).where('role', 'in', ['admin', 'member']).where('user.isAnonymous', '==', false).where('userId', '!=', creatorId);
		const subscribersDB = await q.get();
		//get array of subscribers ids
		const subscribersIds = subscribersDB.docs.map((sub) => sub.data().userId);

		const batch = db.batch();
		subscribersIds.forEach((userId) => {
			const notificationRef = db.collection(Collections.inAppNotifications).doc();
			const notification: NotificationType = {
				userId,
				parentId,
				parentStatement: parent.statement,
				text: statement.statement,
				creatorName: statement.creator.displayName,
				creatorImage: statement.creator.photoURL,
				createdAt: new Date().getTime(),
				read: false,
				notificationId: notificationRef.id,
			}
			batch.set(notificationRef, notification);
		});
		await batch.commit();
	} catch (error) {
		console.error(error);
	}
}