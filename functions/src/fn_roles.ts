import { logger } from "firebase-functions/v1";
import { db } from "./index";
import { Collections, Role, StatementSubscription, StatementSubscriptionSchema, getStatementSubscriptionId } from "delib-npm";

export async function setAdminsToNewStatement(ev: any) {
    try {
        //get parent statement ID
        const statement = ev.data.data();
        logger.info(`New statement: ${statement.statement}, statementId: ${statement.statementId}`);

        //subscribe the creator to the new statement
        const newStatementSubscriptionId = getStatementSubscriptionId(statement.statementId, statement.creator);
        if(!newStatementSubscriptionId) throw new Error("No newStatementSubscriptionId");
        const newSubscription:StatementSubscription= {
            statementId: statement.statementId,
            userId: statement.creatorId,
            role: Role.admin,
            lastUpdate: Date.now(),
            statement,
            statementsSubscribeId: newStatementSubscriptionId,
            notification:false,
            user: statement.creator,
            userAskedForNotification: false,
        };
        StatementSubscriptionSchema.parse(newSubscription);
        await db.collection(Collections.statementsSubscribe).doc(newStatementSubscriptionId).set(newSubscription);
       
        const { parentId } = statement;
        logger.info(`Parent statement ID: ${parentId}`);
      
        //get all admins of the parent statement
        const adminsDB = await db.collection(Collections.statementsSubscribe).where("statementId", "==", parentId).where("role", "==", Role.admin).get();
        if(adminsDB.size === 0) return logger.info("No admins to subscribe to the new statement");
        const adminsSubscriptions = adminsDB.docs.map((doc: any) => doc.data());

       

        //subscribe the admins to the new statement
        adminsSubscriptions.forEach(async (adminSub: StatementSubscription) => {
            try {
                const statementsSubscribeId = getStatementSubscriptionId(statement.statementId, adminSub.user);
                if(!statementsSubscribeId) throw new Error("No statementsSubscribeId");

                const newSubscription:StatementSubscription= {
                    statementId: statement.statementId,
                    userId: adminSub.userId,
                    role: Role.admin,
                    lastUpdate: Date.now(),
                    statement,
                    statementsSubscribeId,
                    notification:adminSub.notification || false,
                    user: adminSub.user,
                    userAskedForNotification: adminSub.userAskedForNotification || false,
                };

                const result = StatementSubscriptionSchema.safeParse(newSubscription);
                if(!result.success){
                   logger.warn(result.error);
                   logger.info(newSubscription);
                   throw new Error("Invalid StatementSubscription");
                }
         
    
                await db.collection(Collections.statementsSubscribe).doc(statementsSubscribeId).set(newSubscription);
                logger.info(`Admin ${adminSub.user.displayName} subscribed to the new statement ${statement.statement}, with subId: ${statementsSubscribeId}`);
            } catch (error) {
                logger.error("In setAdminsToNewStatement, on subscribe the admins to the new statement");
                logger.error(error);
            }
            
        });


    } catch (error) {
        logger.error(error);
    }

}