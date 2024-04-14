import { EnhancedEvaluationThumbs } from "./EnhancedEvaluationModel";

export function evlaluationToIcon(evaluation: number|undefined, evaluations: EnhancedEvaluationThumbs[]):string {
    //find the nearest evaluation
    if (evaluation === undefined) return evaluations[2].id;
    let nearestEvaluation = evaluations[0];
    evaluations.forEach((evl) => {
        if (
            Math.abs(evaluation - evl.evaluation) <
            Math.abs(evaluation - nearestEvaluation.evaluation)
        ) {
            nearestEvaluation = evl;
        }
    });
    return nearestEvaluation.id;
}