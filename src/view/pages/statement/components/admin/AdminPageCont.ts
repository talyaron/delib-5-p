import { getEvaluations } from "../../../../../functions/db/evaluation/getEvaluation";
import { getVoters } from "../../../../../functions/db/vote/getVotes";

export async function handleGetVoters(
    parentId: string | undefined,
    setVoters: (voters: any) => void,
) {
    if (!parentId) return;
    const voters = await getVoters(parentId);
    setVoters(voters);
}

export async function handleGetEvaluators(
    parentId: string | undefined,
    setEvaluators: (evaluators: any) => void,
) {
    if (!parentId) return;
    const evaluators = await getEvaluations(parentId);
    setEvaluators(evaluators);
}
