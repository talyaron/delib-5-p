import { store } from '@/model/store';
import { Collections, getStatementSubscriptionId } from 'delib-npm';
import { doc, runTransaction } from 'firebase/firestore';
import { FireStore as DB } from '../config';

//update favorite use transaction
export async function updateFavorite(statementId: string | undefined) {
    try {
        if (!statementId) throw new Error('Statement not found');
        const user = store.getState().user.user;
        if (!user) throw new Error('User not found');
        const subscriptionId = getStatementSubscriptionId(statementId, user);
        if (!subscriptionId) throw new Error('Subscription not found');

        //use transaction to update favorite
        await runTransaction(DB, async (transaction) => {
            const subscriptionRef = doc(
                DB,
                Collections.statementsSubscribe,
                subscriptionId
            );
            const subscriptionDoc = await transaction.get(subscriptionRef);
            if (!subscriptionDoc.exists()) throw new Error('Subscription not found');
            const subscription = subscriptionDoc.data();
            if (!subscription) throw new Error('Subscription not found');
            transaction.update(subscriptionRef, { favorite: !subscription.favorite });
        });
    } catch (error) {
        console.error(error);
    }
}
