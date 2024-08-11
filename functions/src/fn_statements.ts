import { Collections, Statement } from 'delib-npm';
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
		const statement = e.data.data() as Statement;
		const { parentId, topParentId, statementId } = statement;

		if (parentId === 'top') return;

		if (!parentId) throw new Error('parentId not found');

		//get parent
		const parentRef = db.doc(`statements/${parentId}`);
		const parentDB = await parentRef.get();
		const parent = parentDB.data();
		if (!parent) throw new Error('parent not found');

		//update parent
		const lastMessage = statement.statement;
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
