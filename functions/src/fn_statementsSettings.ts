import { Collections, Statement } from "delib-npm";
import { db } from "./index";
import { isEqualObjects } from "./helpers";


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

export function updateSettings(e: any) {
	try {
		//get statement after update and before update
		const before = e.before.data() as Statement;
		const after = e.after.data() as Statement;

		if (!isEqualObjects(before.questionSettings, after.questionSettings)) {
			//update question settings with new settings
			db.collection(Collections.statements).doc(e.after.statementId).update({
				questionSettings: after.questionSettings,
			});
		}
		if (!isEqualObjects(before.statementSettings, after.statementSettings)) {
			//update statement with new settings
			db.collection(Collections.statements).doc(e.after.statementId).update({
				evaluationSettings: after.statementSettings,
			});
		}
		return;
	} catch (error) {
		console.error(error);
		return;

	}
}