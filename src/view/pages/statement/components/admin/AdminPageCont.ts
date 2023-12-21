import { getVoters } from "../../../../../functions/db/vote/getVotes";

export async function handleGetVoters(setVoters: Function, parentId: string|undefined) {
    if (!parentId) return;
    const voters = await getVoters(parentId);
    setVoters(voters);
}