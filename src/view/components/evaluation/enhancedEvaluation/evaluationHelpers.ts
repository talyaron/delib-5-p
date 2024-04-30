import {
    EnhancedEvaluationThumb,
    enhancedEvaluationsThumbs,
} from "./EnhancedEvaluationModel";

const defaultThumb = enhancedEvaluationsThumbs[2];

export const getEvaluationThumbIdByScore = (
    evaluationScore: number | undefined,
): string => {
    if (evaluationScore === undefined) return defaultThumb.id;

    // find the nearest evaluation
    let nearestThumb = enhancedEvaluationsThumbs[0];

    enhancedEvaluationsThumbs.forEach((evaluationThumb) => {
        const current = Math.abs(evaluationScore - evaluationThumb.evaluation);
        const nearest = Math.abs(evaluationScore - nearestThumb.evaluation);

        if (current < nearest) {
            nearestThumb = evaluationThumb;
        }
    });

    return nearestThumb.id;
};

interface GetEvaluationThumbsParams {
    evaluationScore: number | undefined;
    isEvaluationPanelOpen: boolean;
}

export const getEvaluationThumbsToDisplay = ({
    evaluationScore,
    isEvaluationPanelOpen,
}: GetEvaluationThumbsParams): EnhancedEvaluationThumb[] => {
    if (isEvaluationPanelOpen) {
        return enhancedEvaluationsThumbs;
    }

    if (evaluationScore === undefined) {
        const firstAndLastThumbs = [
            enhancedEvaluationsThumbs[0],
            enhancedEvaluationsThumbs[enhancedEvaluationsThumbs.length - 1],
        ];

        return firstAndLastThumbs;
    }

    const selectedThumbId = getEvaluationThumbIdByScore(evaluationScore);
    const selectedThumb = enhancedEvaluationsThumbs.find(
        (evaluationThumb) => evaluationThumb.id === selectedThumbId,
    );

    return [selectedThumb || defaultThumb];
};
