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
import { Collections, Evaluation, User, UserSchema } from "delib-npm";
import { EvaluationSchema } from "@/model/evaluations/evaluationModel";
import { AppDispatch } from "@/model/store";
import { setEvaluationToStore } from "@/model/evaluations/evaluationsSlice";
import { Unsubscribe } from "firebase/auth";

export const listenToEvaluations = (
	dispatch: AppDispatch,
	parentId: string,
	evaluatorId: string | undefined,
): Unsubscribe => {
	try {
		const evaluationsRef = collection(DB, Collections.evaluations);

		if (!evaluatorId) throw new Error("User is undefined");

		const q = query(
			evaluationsRef,
			where("parentId", "==", parentId),
			where("evaluatorId", "==", evaluatorId),
		);

		return onSnapshot(q, (evaluationsDB) => {
			try {
				evaluationsDB.forEach((evaluationDB) => {
					try {
						//set evaluation to store
						const { success } = EvaluationSchema.safeParse(
							evaluationDB.data(),
						);

						if (!success)
							throw new Error(
								"evaluationDB is not valid in listenToEvaluations()",
							);

						const evaluation = evaluationDB.data() as Evaluation;

						dispatch(setEvaluationToStore(evaluation));
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

		// eslint-disable-next-line @typescript-eslint/no-empty-function
		return () => { };
	}
};

export async function getEvaluations(parentId: string): Promise<Evaluation[]> {
	try {
		const evaluationsRef = collection(DB, Collections.evaluations);
		const q = query(evaluationsRef, where("parentId", "==", parentId));

		const evaluationsDB = await getDocs(q);
		const evaluatorsIds = new Set<string>();
		const evaluations = evaluationsDB.docs
			.map((evaluationDB) => {
				const evaluation = evaluationDB.data() as Evaluation;
				EvaluationSchema.parse(evaluation);

				if (!evaluatorsIds.has(evaluation.evaluatorId)) {
					//prevent duplicate evaluators
					evaluatorsIds.add(evaluation.evaluatorId);

					return evaluation;
				}
			})
			.filter((evaluation) => evaluation) as Evaluation[];

		//get evaluators details if not already in db
		const evaluatorsPromise = evaluations
			.map((evaluation) => {
				if (!evaluation.evaluator) {
					const evaluatorRef = doc(
						DB,
						Collections.users,
						evaluation.evaluatorId,
					);
					const promise = getDoc(evaluatorRef);

					return promise;
				}
			})
			.filter((promise) => promise);

		const evaluatorsDB = await Promise.all(evaluatorsPromise);
		const evaluators = evaluatorsDB.map((evaluatorDB) => {
			const evaluator = evaluatorDB?.data() as User;
			UserSchema.parse(evaluator);
			
			return evaluator;
		}) as User[];

		evaluations.forEach((evaluation) => {
			const evaluator = evaluators.find(
				(evaluator) => evaluator?.uid === evaluation.evaluatorId,
			);
			if (evaluator) evaluation.evaluator = evaluator;
		});

		return evaluations;
	} catch (error) {
		console.error(error);

		return [] as Evaluation[];
	}
}
