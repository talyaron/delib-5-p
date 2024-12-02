import { Collections, Statement, StatementView } from "delib-npm";
import { logger } from "firebase-functions/v1";
import { db } from ".";

//@ts-ignore
export async function updateStatementWithViews(ev) {
	try {
		console.log('updateStatementWithViews')
		const view = ev.data.data() as StatementView;
		const statementId = view.statementId;
		if (!statementId) throw new Error("StatementId not found");
		const statementRef = db.collection(Collections.statements).doc(statementId);

		//increment the view count
		await db.runTransaction(async (t) => {
			try {

				const statementDB = await t.get(statementRef);
				if (!statementDB.exists) throw new Error("Statement not found");
				const statement = statementDB.data() as Statement;
				if (!statement) throw new Error("Statement not found");

				if (!statement.viewed) statement.viewed = { individualViews: 0 };

				const views = statement.viewed.individualViews || 0;
				t.update(statementRef, { "viewed.individualViews": views + 1 });
			} catch (error) {
				console.error(error);

			}
		});

	} catch (error) {
		logger.error(error);
	}
}