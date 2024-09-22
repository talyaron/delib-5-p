import {
	User,
	Collections,
	StatementSubscription,
	StatementSubscriptionSchema,
	StatementType,
	Statement,
	Role,
	StatementSchema,
} from "delib-npm";
import { collection, doc, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";

// Redux Store
import {
	deleteStatement,
	removeMembership,
	setMembership,
	setStatement,
	setStatementSubscription,
	setStatements,
} from "@/model/statements/statementsSlice";
import { AppDispatch, store } from "@/model/store";
import { DB } from "../config";

// Helpers
import { Unsubscribe } from "firebase/auth";

export const listenToStatementSubscription = (statementId: string, user: User, dispatch: AppDispatch): Unsubscribe => {
  try {
    const statementsSubscribeRef = doc(DB, Collections.statementsSubscribe, `${user.uid}--${statementId}`);

    return onSnapshot(statementsSubscribeRef, (statementSubscriptionDB) => {
      try {
        if (!statementSubscriptionDB.exists()) {
          console.info("No subscription found");

          return;
        }
        const statementSubscription = statementSubscriptionDB.data() as StatementSubscription;

        const { role } = statementSubscription;

        //TODO: remove this after 2024-06-06
        const deprecated = new Date("2024-06-06").getTime();

        //@ts-ignore
        if (role === "statement-creator") {
          statementSubscription.role = Role.admin;
        }
        if (role === undefined && new Date().getTime() < deprecated) {
          statementSubscription.role = Role.member;
        } else if (role === undefined) {
          statementSubscription.role = Role.unsubscribed;
          console.info("Role is undefined. Setting role to unsubscribed");
        }

        StatementSubscriptionSchema.parse(statementSubscription);

        dispatch(setStatementSubscription(statementSubscription));
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }
};

export const listenToStatement = (
  statementId: string,
  setIsStatementNotFound?: React.Dispatch<React.SetStateAction<boolean>>
): Unsubscribe => {
  try {
    const dispatch = store.dispatch;
    const statementRef = doc(DB, Collections.statements, statementId);

    return onSnapshot(
      statementRef,
      (statementDB) => {
        try {
          if (!statementDB.exists()) {
            if (setIsStatementNotFound) setIsStatementNotFound(true);
            throw new Error("Statement does not exist");
          }
          const statement = statementDB.data() as Statement;

          dispatch(setStatement(statement));
        } catch (error) {
          console.error(error);
          if (setIsStatementNotFound) setIsStatementNotFound(true);
        }
      },
      (error) => console.error(error)
    );
  } catch (error) {
    console.error(error);
    if (setIsStatementNotFound) setIsStatementNotFound(true);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }
};

export const listenToSubStatements = (statementId: string | undefined, dispatch: AppDispatch): Unsubscribe => {
  try {
    if (!statementId) throw new Error("Statement id is undefined");
    const statementsRef = collection(DB, Collections.statements);
    const q = query(
      statementsRef,
      where("parentId", "==", statementId),
      where("statementType", "!=", StatementType.document),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    let isFirstCall = true;

    return onSnapshot(q, (statementsDB) => {
      const startStatements: Statement[] = [];
      statementsDB.docChanges().forEach((change) => {
        const statement = change.doc.data() as Statement;

        if (change.type === "added") {
          if (isFirstCall) {
            startStatements.push(statement);
          } else {
            dispatch(setStatement(statement));
          }
        }

				if (change.type === "modified") {
					dispatch(setStatement(statement));
				}

				if (change.type === "removed") {
					dispatch(deleteStatement(statement.statementId));
				}

        // There shouldn't be deleted statements. instead the statement should be updated to status "deleted".
        // If You will use delete, it will remove from the dom a messages that are outside of the limit of the query.
      });
      isFirstCall = false;

      dispatch(setStatements(startStatements));
    });
  } catch (error) {
    console.error(error);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }
};

export const listenToMembers = (dispatch: AppDispatch) => (statementId: string) => {
  try {
    const membersRef = collection(DB, Collections.statementsSubscribe);
    const q = query(membersRef, where("statementId", "==", statementId), orderBy("createdAt", "desc"));

    return onSnapshot(q, (subsDB) => {
      subsDB.docChanges().forEach((change) => {
        const member = change.doc.data() as StatementSubscription;
        if (change.type === "added") {
          dispatch(setMembership(member));
        }

        if (change.type === "modified") {
          dispatch(setMembership(member));
        }

        if (change.type === "removed") {
          dispatch(removeMembership(member.statementsSubscribeId));
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};

export async function listenToUserAnswer(questionId: string, cb: (statement: Statement) => void) {
  try {
    const user = store.getState().user.user;
    if (!user) throw new Error("User not logged in");
    const statementsRef = collection(DB, Collections.statements);
    const q = query(
      statementsRef,
      where("statementType", "==", StatementType.option),
      where("parentId", "==", questionId),
      where("creatorId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(1)
    );

		return onSnapshot(q, (statementsDB) => {
			statementsDB.docChanges().forEach((change) => {
				const statement = change.doc.data() as Statement;
				StatementSchema.parse(statement);

        cb(statement);
      });
    });
  } catch (error) {
    console.error(error);
  }
}

export async function listenToChildStatements(
  dispatch: AppDispatch,
  statementId: string,
  callback: (childStatements: Statement[]) => void
): Promise<Unsubscribe | null> {
  try {
    const statementsRef = collection(DB, Collections.statements);
    const q = query(
      statementsRef,
      where("statementType", "!=", StatementType.statement),
      where("parents", "array-contains", statementId)
    );

    const unsubscribe = onSnapshot(q, (statementsDB) => {
      const childStatements: Statement[] = [];

      statementsDB.forEach((doc) => {
        const childStatement = doc.data() as Statement;
        childStatements.push(childStatement);
        dispatch(setStatement(childStatement));
      });

      callback(childStatements);
    });

    return unsubscribe;
  } catch (error) {
    console.error(error);
    return null;
  }
}
