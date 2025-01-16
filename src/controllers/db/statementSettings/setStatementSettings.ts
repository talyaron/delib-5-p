import { Collections, Statement, StatementSettings, QuestionSettings } from "delib-npm";
import { doc, setDoc } from "firebase/firestore";
import { FireStore } from "../config";



interface SetStatementSettingsProps {
	statement: Statement,
	property: keyof StatementSettings | keyof QuestionSettings,
	newValue: boolean,
	settingsSection: keyof Statement
}

export function setStatementSettingToDB({ statement, property, newValue, settingsSection }: SetStatementSettingsProps) {
	try {
		console.log({ [property]: newValue })
		const statementSettingsRef = doc(FireStore, Collections.statementsSettings, statement.statementId);
		setDoc(statementSettingsRef, {
			[settingsSection]: {
				[property]: newValue
			}
		}, { merge: true });
	} catch (error) {
		console.error(error);

	}
}