import { Collections, Statement } from "delib-npm";
import { db } from "./index";
import { isEqualObjects } from "./helpers";
import { createStagesForQuestionDocument } from "./fn_questionDocuments";


/**
 * Statement Settings Security Model
 * -------------------------------
 * 
 * Purpose:
 * Protect statement settings from unauthorized modifications by enforcing that only
 * admin-triggered Cloud Functions can modify these settings.
 * 
 * Implementation:
 * 1. Client-side Updates:
 *    - Users submit setting changes through Collection.statementSettings
 *    - This creates an audit trail and ensures proper validation
 * 
 * 2. Server-side Processing:
 *    - Cloud Functions listen to Collection.statementSettings changes
 *    - Only these functions have permission to update the settings in statements
 * 
 * 3. Security Rules:
 *    - Block direct client modifications to settings fields in statements
 *    - Allow only authenticated Cloud Functions to modify these fields
 *    - Regular users can still read settings and modify non-settings fields
 * 
 * Example Flow:
 * User -> Collection.statementSettings -> Cloud Function -> Statement.settings
 * 
 * Protected Fields:
 * - statement.settings
 * - statement.documentSettings
 * - [Add other protected settings fields here]
 */

export async function updateSettings(e: any) {
	try {
		//get statement after update and before update

		const statementId = e.params.statementId;
		console.log('updateSettings.....', statementId);

		if (!statementId) throw new Error('No statementId provided');


		const before = e.data.before.data() as Statement | undefined;
		const after = e.data.after.data() as Statement | undefined;

		//Update question settings
		if (!isEqualObjects(before?.questionSettings, after?.questionSettings)) {
			//update question settings with new settings
			if (after) {
				db.collection(Collections.statements).doc(statementId).update({
					questionSettings: after.questionSettings,
				});
			}

			//if question is a document, create stages
			if (!before?.questionSettings?.isDocument && after?.questionSettings?.isDocument) {
				//create stages for the question-document
				createStagesForQuestionDocument(after);
			}
		}

		//Update statement settings
		if (!isEqualObjects(before?.statementSettings, after?.statementSettings)) {
			//update statement with new settings

			if (after?.statementSettings) {
				console.log("save statement settings")
				await db.collection(Collections.statements).doc(statementId).update({
					statementSettings: after?.statementSettings,
				})
			}
		}
		return;
	} catch (error) {
		console.error(error);
		return;

	}
}