import { Statement, NavObject, Screen } from "delib-npm";
import { getVoters } from "../../../../../functions/db/vote/getVotes";
import { getEvaluations } from "../../../../../functions/db/evaluation/getEvaluation";


export async function handleGetVoters(
    parentId: string | undefined,
    setVoters: Function,
    setClicked: Function
) {
    if (!parentId) return;
    const voters = await getVoters(parentId);
    setVoters(voters);
    setClicked(true);
}

export async function handleGetEvaluators(
    parentId: string | undefined,
    setEvaluators: Function,
    setClicked: Function
) {
    if (!parentId) return;
    const evaluators = await getEvaluations(parentId);
    setEvaluators(evaluators);
    setClicked(true);
}

export function isSubPageChecked(
    statement: Statement | undefined,
    navObj: NavObject
) {
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
    } catch (error) {
        console.error(error);
        return true;
    }
}

