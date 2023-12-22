import {
    collection,
    onSnapshot,
    query,
    where,
    doc,
    getDocs,
    getDoc,
} from "@firebase/firestore";
import { DB } from "../config";
import { Collections, Evaluation, User } from "delib-npm";
import { getUserFromFirebase } from "../users/usersGeneral";
import { EvaluationSchema } from "../../../model/evaluations/evaluationModel";

export function listenToEvaluations(
    parentId: string,
    updateCallBack: Function
): Function {
    try {
        const evaluationsRef = collection(DB, Collections.evaluations);
        const evaluatorId = getUserFromFirebase()?.uid;
        if (!evaluatorId) throw new Error("User is undefined");

        const q = query(
            evaluationsRef,
            where("parentId", "==", parentId),
            where("evaluatorId", "==", evaluatorId)
        );
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
        return () => {};
    }
}

export async function getEvaluations(parentId: string): Promise<Evaluation[]> {
    try {
        const evaluationsRef = collection(DB, Collections.evaluations);
        const q = query(evaluationsRef, where("parentId", "==", parentId));

        const evaluationsDB = await getDocs(q);
        const evauatorsIds = new Set<string>();
        const evaluations = evaluationsDB.docs.map((evaluationDB: any) => {
            const evaluation = evaluationDB.data() as Evaluation;
            if (!evauatorsIds.has(evaluation.evaluatorId)) {
                //prevent duplicate evaluators
                evauatorsIds.add(evaluation.evaluatorId);
                return evaluation;
            }
        }).filter((evaluation) => evaluation) as Evaluation[];

        //get evaluators details if not allready in db
        const evaluatorsPromise = evaluations.map((evaluation) => {
            if (!evaluation.evaluator) {
                const evaluatorRef = doc(
                    DB,
                    Collections.users,
                    evaluation.evaluatorId
                );
                const promise = getDoc(evaluatorRef);
                return promise;
            }
        }).filter((promise) => promise) as Promise<any>[];

        const evaluatorsDB = await Promise.all(evaluatorsPromise);
        const evaluators = evaluatorsDB.map((evaluatorDB) =>
            evaluatorDB?.data()
        ) as User[];

        evaluations.forEach((evaluation) => {
            const evaluator = evaluators.find(
                (evaluator) => evaluator?.uid === evaluation.evaluatorId
            );
            if (evaluator) evaluation.evaluator = evaluator;
        });
        return evaluations;
    } catch (error) {
        console.error(error);
        return [] as Evaluation[];
    }
}
