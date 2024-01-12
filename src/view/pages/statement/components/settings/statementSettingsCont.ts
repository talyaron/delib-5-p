import { Statement, NavObject, Screen, Vote, Evaluation } from "delib-npm";
import { getVoters } from "../../../../../functions/db/vote/getVotes";
import { getEvaluations } from "../../../../../functions/db/evaluation/getEvaluation";

export async function handleGetVoters(
    parentId: string | undefined,
    setVoters: React.Dispatch<React.SetStateAction<Vote[]>>,
    setClicked: React.Dispatch<React.SetStateAction<boolean>>,
) {
    if (!parentId) return;
    const voters = await getVoters(parentId);
    setVoters(voters);
    setClicked(true);
}

export async function handleGetEvaluators(
    parentId: string | undefined,
    setEvaluators: React.Dispatch<React.SetStateAction<Evaluation[]>>,
    setClicked: React.Dispatch<React.SetStateAction<boolean>>,
) {
    if (!parentId) return;
    const evaluators = await getEvaluations(parentId);
    setEvaluators(evaluators);
    setClicked(true);
}

export function isSubPageChecked(
    statement: Statement | undefined,
    navObj: NavObject,
): boolean {
    try {
        //in case of a new statement
        if (!statement) {
            if (navObj.default === false) return false;
            else return true;
        }

        //in case of an existing statement
        const subScreens = statement.subScreens as Screen[];
        if (subScreens === undefined) return true;
        if (subScreens?.includes(navObj.link)) return true;

        return false;
    } catch (error) {
        console.error(error);

        return true;
    }
}
