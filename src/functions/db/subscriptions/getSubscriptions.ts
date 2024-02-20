import { Collections, StatementSubscription } from "delib-npm";
import { store } from "../../../model/store";
import { getStatementSubscriptionId } from "../../general/helpers";
import { doc, getDoc } from "firebase/firestore";
import { DB } from "../config";

export async function getTopParentSubscriptionFromDB(statementId:string):Promise<StatementSubscription | undefined>{
    try {
        //try to get from store first
        const statementSubscription = store.getState().statements.statementSubscription.find(ssb=>ssb.statementId === statementId);
        if(statementSubscription) return statementSubscription;

        //if not found in store, get from DB
        const user = store.getState().user.user;
        if(!user) throw new Error("User not logged in");    

        const statementsSubscribeId = getStatementSubscriptionId(user.uid, statementId);
        const statementSubscriptionRef = doc(DB, Collections.statementsSubscribe, statementsSubscribeId);
        const statementSubscriptionDB = await getDoc(statementSubscriptionRef);
        if(!statementSubscriptionDB.exists()) throw new Error("Statement subscription not found");
        return statementSubscriptionDB.data() as StatementSubscription;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
