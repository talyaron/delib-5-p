import { StatementMeta } from "delib-npm";
import { Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { DB } from "../config";
import { Dispatch } from "@reduxjs/toolkit";
import { setStatementMeta } from "../../../model/statements/statementsMetaSlice";

export function listenToStatementMeta(statementId: string, dispatch: Dispatch): Unsubscribe {
    try {
        if (!statementId) {
            throw new Error("Statement ID is missing");
        }

        const statementMetaRef = doc(DB, "statementsMeta", statementId);
        return onSnapshot(statementMetaRef, (statementMetaDB) => {
            try {
                if (!statementMetaDB.exists()) {
                    throw new Error("Statement meta does not exist");
                }
                const statementMeta = statementMetaDB.data() as StatementMeta;
                // StatementMetaSchema.parse(statementMeta);


                dispatch(setStatementMeta(statementMeta));
            } catch (error) {
                console.error(error);
            }
        });
    } catch (error) {
        console.error(error);
        return () => { };
    }
}