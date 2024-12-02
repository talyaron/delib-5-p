import { logger } from "firebase-functions/v1";
import { db } from "./index";
import { FieldValue } from "firebase-admin/firestore";
import {
	Collections,
	Evaluation,
	ResultsBy,
	SimpleStatement,
	Statement,
	StatementSchema,
	User,
	statementToSimpleStatement,
} from "delib-npm";
import { z } from "zod";
import { DeliberativeElement } from "delib-npm/dist/models/statementsModels";

enum ActionTypes {
    new = "new",
    update = "update",
    delete = "delete",
}

//@ts-ignore
export async function newEvaluation(event) {
	try {
		//add evaluator to statement

		const statementEvaluation = event.data.data() as Evaluation;
		const { statementId } = statementEvaluation;
		if (!statementId) throw new Error("statementId is not defined");

		//add one evaluator to statement, and add evaluation to statement
		const statement = await _updateStatementEvaluation({ statementId, evaluationDiff: statementEvaluation.evaluation, addEvaluator: 1, action: ActionTypes.new, newEvaluation: statementEvaluation.evaluation, oldEvaluation: 0 });
		if (!statement) throw new Error("statement does not exist");
		updateParentStatementWithChildResults(statement.parentId);

		//update evaluators that the statement was evaluated
		const evaluator: User | undefined = statementEvaluation.evaluator;
		if (!evaluator) throw new Error("evaluator is not defined");
        
		// const evaluatorData = await getEvaluatorData(evaluator, statement);
		// if (!evaluatorData) throw new Error("evaluatorData is not defined");

		// await updateStatementMetaDataAndEvaluator(evaluator, evaluatorData, statement);

		return;

	} catch (error) {
		logger.error(error);
		
		return;
	}

}

//@ts-ignore
export async function deleteEvaluation(event) {
	try {
		//add evaluator to statement
		const statementEvaluation = event.data.data() as Evaluation;
		const { statementId, evaluation } = statementEvaluation;
		if (!statementId) throw new Error("statementId is not defined");

		//add one evaluator to statement
		const statement = await _updateStatementEvaluation({ statementId, evaluationDiff: (-1 * evaluation), addEvaluator: -1, action: ActionTypes.delete, newEvaluation: 0, oldEvaluation: evaluation });
		if (!statement) throw new Error("statement does not exist");
		updateParentStatementWithChildResults(statement.parentId);

	} catch (error) {
		logger.error(error);
	}
}

//update evaluation of a statement
//@ts-ignore
export async function updateEvaluation(event) {
	try {

		const statementEvaluationBefore = event.data.before.data() as Evaluation;
		const { evaluation: evaluationBefore } = statementEvaluationBefore;
		const statementEvaluationAfter = event.data.after.data() as Evaluation;
		const { evaluation: evaluationAfter, statementId } = statementEvaluationAfter;
		const evaluationDiff = evaluationAfter - evaluationBefore;

		if (!statementId) throw new Error("statementId is not defined");

		//get statement
		const statement = await _updateStatementEvaluation({ statementId, evaluationDiff, action: ActionTypes.update, newEvaluation: evaluationAfter, oldEvaluation: evaluationBefore });
		if (!statement) throw new Error("statement does not exist");

		//update parent statement?
		updateParentStatementWithChildResults(statement.parentId);
	} catch (error) {
		console.info("error in updateEvaluation");
		logger.error(error);

		return;
	}
}

//inner functions

function calcAgreement(newSumEvaluations: number, numberOfEvaluators: number): number {
	// agreement calculations (social choice theory)
	// The aim of the consensus calculation is to give statement with more positive evaluation and less negative evaluations,
	// while letting small groups with higher consensus an upper hand, over large groups with a lot of negative evaluations.
	try {
		z.number().parse(newSumEvaluations);
		z.number().parse(numberOfEvaluators);

		if (numberOfEvaluators === 0) numberOfEvaluators = 1;
		const averageEvaluation = newSumEvaluations / numberOfEvaluators; // average evaluation
		const agreement = averageEvaluation * Math.sqrt(numberOfEvaluators)
		// divide by the number of question members to get a scale of 100% agreement

		return agreement;
	} catch (error) {
		logger.error(error);
		
		return 0;
	}
}

interface UpdateStatementEvaluation {
    statementId: string;
    evaluationDiff: number;
    addEvaluator?: number;
    action: ActionTypes;
    newEvaluation: number;
    oldEvaluation: number;
}

async function _updateStatementEvaluation({ statementId, evaluationDiff, addEvaluator = 0, action, newEvaluation, oldEvaluation }: UpdateStatementEvaluation): Promise<Statement | undefined> {
	try {

		if (!statementId) throw new Error("statementId is not defined");
		const { success } = z.number().safeParse(evaluationDiff);
		if (!success) throw new Error("evaluation is not a number, or evaluation is missing");

		const proConDiff = calcDiffEvaluation({ newEvaluation, oldEvaluation, action });

		const _statement: Statement = await db.runTransaction(async (transaction) => {
			const statementRef = db.collection(Collections.statements).doc(statementId);
			const statementDB = await transaction.get(statementRef);
			const statement = statementDB.data() as Statement;

			//for legacy peruses, we need to parse the statement to the new schema
			if (!statement.evaluation) {

				statement.evaluation = {
					agreement: statement.consensus || 0,
					sumEvaluations: evaluationDiff,
					numberOfEvaluators: statement.totalEvaluators || 1,
					sumPro: proConDiff.proDiff,
					sumCon: proConDiff.conDiff

				};
				await transaction.update(statementRef, { evaluation: statement.evaluation });
			} else {
				statement.evaluation.sumEvaluations += evaluationDiff;
				statement.evaluation.numberOfEvaluators += addEvaluator;
				statement.evaluation.sumPro ? statement.evaluation.sumPro += proConDiff.proDiff : statement.evaluation.sumPro = proConDiff.proDiff;
				statement.evaluation.sumCon ? statement.evaluation.sumCon += proConDiff.conDiff : statement.evaluation.sumCon = proConDiff.conDiff;
			}

			StatementSchema.parse(statement);
			const newSumEvaluations = statement.evaluation.sumEvaluations;
			const newNumberOfEvaluators = statement.evaluation.numberOfEvaluators;

			const agreement = calcAgreement(newSumEvaluations, newNumberOfEvaluators);
			statement.evaluation.agreement = agreement;
			statement.consensus = agreement;

			transaction.update(statementRef, {
				totalEvaluators: FieldValue.increment(addEvaluator),
				consensus: agreement,
				evaluation: statement.evaluation,
				proSum: FieldValue.increment(proConDiff.proDiff),
				conSum: FieldValue.increment(proConDiff.conDiff),
			});

			const _st = await statementRef.get();
			
			return _st.data() as Statement;
		});

		return _statement as Statement;

	} catch (error) {
		logger.error(error);
		
		return undefined;
	}
}

interface CalcDiff { proDiff: number, conDiff: number }

function calcDiffEvaluation({ action, newEvaluation, oldEvaluation }: { action: ActionTypes, newEvaluation: number, oldEvaluation: number }): CalcDiff {
	try {
		const positiveDiff = Math.max(newEvaluation, 0) - Math.max(oldEvaluation, 0);
		const negativeDiff = Math.min(newEvaluation, 0) - Math.min(oldEvaluation, 0);

		switch (action) {
		case ActionTypes.new:
			return { proDiff: Math.max(newEvaluation, 0), conDiff: Math.max(-newEvaluation, 0) };
		case ActionTypes.delete:
			return { proDiff: Math.min(-oldEvaluation, 0), conDiff: Math.max(oldEvaluation, 0) };
		case ActionTypes.update:
			return { proDiff: positiveDiff, conDiff: -negativeDiff };
		default:
			throw new Error("Action is not defined correctly");
		}
	} catch (error) {
		logger.error(error);
		
		return { proDiff: 0, conDiff: 0 };
	}
}
interface ResultsSettings {
    resultsBy: ResultsBy;
    numberOfResults?: number;
    deep?: number;
    minConsensus?: number;
    solutions?: SimpleStatement[];
}

function getResultsSettings(
	results: ResultsSettings | undefined,
): ResultsSettings {
	if (!results) {
		return {
			resultsBy: ResultsBy.topOptions,
		};
	} else {
		return results;
	}
}

async function updateParentStatementWithChildResults(
	parentId: string | undefined,
) {
	try {
        
		if (!parentId) throw new Error("parentId is not defined");

		//get parent statement
		const parentStatementRef = db.collection("statements").doc(parentId);
		const parentStatementDB = await parentStatementRef.get();
		if (!parentStatementDB.exists)
			throw new Error("parentStatement does not exist");
		const parentStatement = parentStatementDB.data() as Statement;

		//get results settings
		const { resultsSettings } = parentStatement;
		let {resultsBy} = getResultsSettings(resultsSettings);
		const { numberOfResults = 1 } =
            getResultsSettings(resultsSettings);
		
		// if (numberOfResults === undefined) numberOfResults = 1;
		if (resultsBy === undefined) resultsBy = ResultsBy.topOptions;

		//this function is responsible for converting the results of evaluation of options

		if (resultsBy !== ResultsBy.topOptions) {
			//remove it when other evaluation methods will be added
			//topVote will be calculated in the votes function
			return;
		}

		//get all options of the parent statement
		const allOptionsStatementsRef = db
			.collection(Collections.statements)
			.where("parentId", "==", parentId)
			.where("deliberativeElement", "==", DeliberativeElement.option);

		//get top options
		const topOptionsStatementsRef = allOptionsStatementsRef
			.orderBy("consensus", "desc") //TODO: in the future (1st aug 2024), this will be changed to evaluation.agreement
			.limit(numberOfResults);
		const topOptionsStatementsDB = await topOptionsStatementsRef.get();
		const topOptionsStatements = topOptionsStatementsDB.docs.map(
			(doc) => doc.data() as Statement,
		);
        
		//get all options of the parent statement and convert them to either result, or an option
		const topOptionsIds = topOptionsStatements.map(
			(st: Statement) => st.statementId,
		);

		const optionsDB = await allOptionsStatementsRef.get();

		const batch = db.batch();

		optionsDB.forEach((stDB) => {
			const st = stDB.data() as Statement;
            
			const statementRef = db.collection(Collections.statements).doc(st.statementId);

			if (topOptionsIds.includes(st.statementId)) {
				batch.update(statementRef, { isResult: true });
			} else {
				batch.update(statementRef, { isResult: false });
			}
		});

		await batch.commit();

		await updateParentChildren(topOptionsStatements, numberOfResults);

		//update child statement selected to be of type result
	} catch (error) {
		logger.error(error);
	}

	async function updateParentChildren(
		topOptionsStatements: Statement[],
		numberOfResults = 1,
	) {
        
		const childStatementsSimple = topOptionsStatements.map(
			(st: Statement) => statementToSimpleStatement(st),
		);

		if (!parentId) throw new Error("parentId is not defined");

		//update parent with results
		await db.collection(Collections.statements).doc(parentId).update({
			totalResults: numberOfResults,
			results: childStatementsSimple,
		});
	}
}