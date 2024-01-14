import { z } from "zod";
import { ScreenSchema } from "../system";

export const StatementNavSchema = z.object({
    link: ScreenSchema,
    name: z.string(),
    id: z.string(),
});
