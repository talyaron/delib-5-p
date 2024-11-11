import { z } from 'zod';

export const EvaluationSchema = z.object({
	parentId: z.string(),
	evaluationId: z.string(),
	statementId: z.string(),
	evaluatorId: z.string(),
	updatedAt: z.number(),
	evaluation: z.number(),
});

export type Evaluation = z.infer<typeof EvaluationSchema>;
