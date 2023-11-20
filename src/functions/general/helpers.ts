import { Role, Statement, StatementSchema, StatementSubscription, StatementSubscriptionSchema, StatementType, User } from "delib-npm";
import { store } from "../../model/store";



export function updateArray(
  currentArray: Array<any>,
  newItem: any,
  updateByProperty: string
): Array<any> {
  try {
    const arrayTemp = [...currentArray];

    if (!newItem[updateByProperty]) {
      throw new Error(`Item dont have property ${updateByProperty}`);
    }
    //find in array;
    const index = arrayTemp.findIndex(
      (item) => item[updateByProperty] === newItem[updateByProperty]
    );
    if (index === -1) arrayTemp.push(newItem);
    else {
      const oldItem = JSON.stringify(arrayTemp[index]);
      const newItemString = JSON.stringify({ ...arrayTemp[index], ...newItem });
      if (oldItem !== newItemString) arrayTemp[index] = { ...arrayTemp[index], ...newItem };


    }

    return arrayTemp;
  } catch (error) {
    console.error(error);
    return currentArray;
  }
}

export function setIntialLocationSessionStorage(pathname: string | null) {
  try {
    if (pathname === '/') pathname = '/home';
    sessionStorage.setItem('initialLocation', pathname || '/home');

  } catch (error) {
    console.error(error);
  }
}
export function getIntialLocationSessionStorage(): string | undefined {
  try {
    return sessionStorage.getItem('initialLocation') || undefined;

  } catch (error) {
    console.error(error);
    return undefined;
  }
}

interface getNewStatmentProps {
  value?: string | undefined | null,
  statement?: Statement,
  type?: StatementType,
  user: User
}

export function getNewStatment({ value, statement, type, user }: getNewStatmentProps): Statement | undefined {

  try {

    if (!statement) throw new Error('No statement');
    if (!user) throw new Error('No user');
    if (!value) throw new Error('No value');


    const userId = user.uid;


    const creator = user;
    if (!creator) throw new Error('User not logged in');

    const newStatement: Statement = {
      statement: value,
      statementId: crypto.randomUUID(),
      creatorId: userId,
      creator,
      createdAt: new Date().getTime(),
      lastUpdate: new Date().getTime(),
      parentId: statement.statementId,
      topParentId: statement.topParentId || statement.statementId ||"top",
      type: type || StatementType.STATEMENT,
      consensus: 0,
      isOption: type === StatementType.SOLUTION ? true : false,
    };


    return newStatement;
  } catch (error) {
    console.error(error);
    return undefined
  }
}


export function isAuthorized(statement: Statement, statementSubscription: StatementSubscription | undefined, authrizedRoles?: Array<Role>) {
  try {
    if(!statement) return false;
    StatementSchema.parse(statement);


    const user = store.getState().user.user;
    if (!user || !user.uid) throw new Error('No user');
    if (statement.creatorId === user.uid) return true;

    if (!statementSubscription) return false;
    StatementSubscriptionSchema.parse(statementSubscription);

    const role = statementSubscription?.role || Role.guest;

    if (role === Role.admin || role === Role.statementCreator || role === Role.systemAdmin) return true;

    if (authrizedRoles && authrizedRoles.includes(role)) return true;
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}