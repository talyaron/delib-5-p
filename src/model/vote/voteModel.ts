import { z } from "zod";

export const voteSchema = z.object({
    voteId: z.string(),
    statementId: z.string(),
    userId: z.string(),
    parentId: z.string(),
    lastUpdate: z.number(),
    createdAt: z.number(),
});

export type Vote = z.infer<typeof voteSchema>;

export function getVoteId(userId: string, parentId: string) {
    return `${userId}--${parentId}`;
}