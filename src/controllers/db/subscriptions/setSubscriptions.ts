import { Statement, Role, StatementSchema, Collections, User, StatementSubscriptionSchema } from "delib-npm";
import { doc, updateDoc, setDoc, Timestamp, getDoc } from "firebase/firestore";
import { DB } from "../config";
import { getUserFromFirebase } from "../users/usersGeneral";
import { getStatementSubscriptionId, writeZodError } from "@/controllers/general/helpers";
import { store } from "@/model/store";

export async function setStatementSubscriptionToDB(
	statement: Statement,
	role: Role = Role.member,
	userAskedForNotification = false
) {
	try {
		
		const user = store.getState().user.user;
		if (!user) throw new Error("User not logged in");
		if (!user.uid) throw new Error("User not logged in");

		const results = StatementSchema.safeParse(statement);
		if (!results.success) {
			writeZodError(results.error, statement);
			throw new Error("Error in statement schema");
		}

		const { statementId } = statement;

		const statementsSubscribeId = getStatementSubscriptionId(statementId, user);
		if (!statementsSubscribeId)
			throw new Error("Error in getting statementsSubscribeId");

		const statementsSubscribeRef = doc(
			DB,
			Collections.statementsSubscribe,
			statementsSubscribeId
		);

		if (userAskedForNotification) {
			return await updateDoc(statementsSubscribeRef, {
				userAskedForNotification: true,
			});
		}

		//check if user is already subscribed
		const statementSubscription = await getDoc(statementsSubscribeRef);
		if (statementSubscription.exists()) return;

		//if not subscribed, subscribe
		const subscriptionData = {
			user,
			statementsSubscribeId,
			statement,
			role,
			userId: user.uid,
			statementId,
			lastUpdate: Timestamp.now().toMillis(),
			createdAt: Timestamp.now().toMillis(),
		};

		if(user.uid === statement.creatorId) subscriptionData.role = Role.admin;

		StatementSubscriptionSchema.parse(subscriptionData);

		await setDoc(
			statementsSubscribeRef,
			subscriptionData,
			{ merge: true }
		);
	} catch (error) {
		console.error(error);
	}
}

export async function updateSubscriberForStatementSubStatements(
	statement: Statement
) {
	try {
		const user = getUserFromFirebase();
		if (!user) throw new Error("User not logged in");
		if (!user.uid) throw new Error("User not logged in");

		const statementsSubscribeId = `${user.uid}--${statement.statementId}`;

		const statementsSubscribeRef = doc(
			DB,
			Collections.statementsSubscribe,
			statementsSubscribeId
		);
		const newSubStatmentsRead = {
			totalSubStatementsRead: statement.totalSubStatements || 0,
		};

		await updateDoc(statementsSubscribeRef, newSubStatmentsRead);
	} catch (error) {
		console.error(error);
	}
}

export async function setRoleToDB(
	statement: Statement,
	role: Role,
	user: User
): Promise<void> {
	try {
		//getting current user role in statement
		const currentUser = store.getState().user.user;
		if (!currentUser) throw new Error("User not logged in");
		const currentUserStatementSubscriptionId = getStatementSubscriptionId(
			statement.statementId,
			currentUser
		);
		if (!currentUserStatementSubscriptionId)
			throw new Error("Error in getting statementSubscriptionId");
		const currentUserStatementSubscriptionRef = doc(
			DB,
			Collections.statementsSubscribe,
			currentUserStatementSubscriptionId
		);
		const currentUserStatementSubscription = await getDoc(
			currentUserStatementSubscriptionRef
		);
		const currentUserRole = currentUserStatementSubscription.data()?.role;
		if (!currentUserRole) throw new Error("Error in getting currentUserRole");
		if (currentUserRole !== Role.admin || statement.creator.uid === user.uid)
			return;

		//setting user role in statement
		const statementSubscriptionId = getStatementSubscriptionId(
			statement.statementId,
			user
		);
		if (!statementSubscriptionId)
			throw new Error("Error in getting statementSubscriptionId");
		const statementSubscriptionRef = doc(
			DB,
			Collections.statementsSubscribe,
			statementSubscriptionId
		);

		return setDoc(statementSubscriptionRef, { role }, { merge: true });
	} catch (error) {
		console.error(error);
	}
}

export async function updateMemberRole(
	statementId: string,
	userId: string,
	newRole: Role
): Promise<void> {
	try {
		const statementSubscriptionId = getStatementSubscriptionId(statementId, {
			uid: userId,
			displayName: "",
		});
		if (!statementSubscriptionId)
			throw new Error("Error in getting statementSubscriptionId");

		const statementSubscriptionRef = doc(
			DB,
			Collections.statementsSubscribe,
			statementSubscriptionId
		);
		await updateDoc(statementSubscriptionRef, { role: newRole });
	} catch (error) {
		console.error("Error updating member role:", error);
	}
}
