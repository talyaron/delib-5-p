import {z} from 'zod';

export const UserSchema = z.object({
    displayName:z.string(),
    email:z.string().optional().nullable(),
    photoURL:z.string().optional(),
    uid:z.string(),

}) 

export type User = z.infer<typeof UserSchema>;