import { Dispatch } from "@reduxjs/toolkit";
import { Collections, StatementMetaData, StatementMetaDataSchema } from "delib-npm";
import { Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { FireStore } from "@/controllers/db/config";
import { writeZodError } from "@/controllers/general/helpers";
import { setStatementMetaData } from "@/model/statements/statementsMetaSlice";
import { store } from "@/model/store";

export function listenToStatementMetaData(statementId: string): Unsubscribe {
	try {
		const dispatch = store.dispatch as Dispatch;
		if (!statementId) {
			throw new Error("Statement ID is missing");
		}

		const statementMetaDataRef = doc(FireStore, Collections.statementsMetaData, statementId);
		
		return onSnapshot(statementMetaDataRef, (statementMetaDataDB) => {
			try {
				if (!statementMetaDataDB.exists()) {
					throw new Error("Statement meta does not exist");

				}
				const statementMetaData = statementMetaDataDB.data() as StatementMetaData;

				const results = StatementMetaDataSchema.safeParse(statementMetaData);
				if (!results.success) {
					writeZodError(results.error, statementMetaData);
					throw new Error("StatementMetaDataSchema failed to parse");
				}

				dispatch(setStatementMetaData(statementMetaData));
			} catch (error) {
				console.error(error);
			}
		});
	} catch (error) {
		console.error(error);

		//@ts-ignore
		return () => {console.error("Unsubscribe function not returned")};
	}
}