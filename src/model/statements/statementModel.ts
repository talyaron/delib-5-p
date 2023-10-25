import {z} from 'zod';
import { UserSchema } from '../users/userModel';
import { ScreenSchema } from '../system';

export enum StatementType {
    STATEMENT = 'statement',
    GROUP = 'GROUP',
    OPTION = 'option'
};

const statementType = z.enum([StatementType.STATEMENT, StatementType.GROUP, StatementType.OPTION]);



export const StatementSchema = z.object({
    statement:z.string(),
    statementId:z.string(),
    creatorId:z.string(),
    creator:UserSchema,
    parentId:z.string(),
    hasChildren:z.boolean().optional(),
    lastMessage:z.string().optional(),
    lastUpdate:z.number(),
    createdAt:z.number(),
    type:statementType,
    isOption:z.boolean().optional(),
    pro:z.number().optional(),
    con:z.number().optional(),
    consensus:z.number(),
    order:z.number().optional(),
    elementHight:z.number().optional(),
    votes:z.number().optional(),
    selections:z.any().optional(),
    voted:z.number().optional(),
    totalSubStatements:z.number().optional(),
    subScreens:z.array(ScreenSchema).optional(),
});

export type Statement = z.infer<typeof StatementSchema>;

export const StatementSubscriptionSchema = z.object({
    role:z.string(),
    userId:z.string(),
    statementId:z.string(),
    lastUpdate:z.number(),
    statementsSubscribeId:z.string(),
    statement:StatementSchema,
    notification:z.boolean().optional(),
    token:z.string().optional(),
    totalSubStatementsRead:z.number().optional(),
});

export type StatementSubscription = z.infer<typeof StatementSubscriptionSchema>;

export const StatementSubscriptionNotificationSchema = z.object({
    statementId:z.string(),
    userId:z.string(),
    subscribed:z.boolean(),
    token:z.string(),
    notification:z.boolean().optional()
});

export type StatementSubscriptionNotification = z.infer<typeof StatementSubscriptionNotificationSchema>;