import { Unsubscribe, collection, onSnapshot, query, where } from "firebase/firestore";
import { FireStore } from "../config";
import { Collections, Stage, StageSchema } from "delib-npm";
import { store } from "@/model/store";
import { removeStageByStageId, setStage } from "@/model/stages/stagesSlice";

export function listenToStages(statementId: string): Unsubscribe {
    try {
        const dispatch = store.dispatch;
        const stagesRef = collection(FireStore, Collections.stages);
        const q = query(stagesRef, where("statementId", "==", statementId));

        return onSnapshot(q, (stagesDB) => {
            try {
                stagesDB.docChanges().forEach((change) => {
                    if (change.type === "added" || change.type === "modified") {
                        const newStage = change.doc.data() as Stage;
                        const r = StageSchema.safeParse(newStage);
                        if (r.success) {
                            dispatch(setStage(r.data));
                        }
                        else {
                            console.error(r.error);
                        }

                    } else if (change.type === "removed") {
                        dispatch(removeStageByStageId(change.doc.id));
                    }
                });
            } catch (error) {
                console.error(error);

            }
        });

    } catch (error) {
        console.error(error);

        return () => { return }
    }
}