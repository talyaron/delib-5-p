import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { DB } from "../config";
import { Collections } from "delib-npm";
import { getUserFromFirebase } from "../users/usersGeneral";
import { EvaluationSchema } from "../../../model/evaluations/evaluationModel";

export function listenToEvaluations(parentId: string, updateCallBack: Function): Function {
    try {
        const evaluationsRef = collection(DB, Collections.evaluations);
        const evaluatorId = getUserFromFirebase()?.uid;
        if (!evaluatorId) throw new Error("User is undefined");

        const q = query(evaluationsRef, where("parentId", "==", parentId), where("evaluatorId", "==", evaluatorId));
        return onSnapshot(q, (evaluationsDB) => {
            try {
                evaluationsDB.forEach((evaluationDB) => {
                    try {
                    
                        //set evaluation to store
                        EvaluationSchema.parse(evaluationDB.data());
                        updateCallBack(evaluationDB.data());

                    } catch (error) {
                        console.error(error);
                    }
                });
            } catch (error) {
                console.error(error);
            }
        });
    } catch (error) {
        console.error(error);
        return () => { };
    }
}