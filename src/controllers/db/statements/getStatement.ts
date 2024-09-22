import { and, collection, doc, getDoc, getDocs, or, query, where } from "firebase/firestore";

// Third party imports
import {
	Collections,
	Statement,
	StatementSchema,
	StatementType,
} from "delib-npm";

// Helpers
// import { listenedStatements } from "../../../view/pages/home/Home";
import { DB } from "../config";

export async function getStatementFromDB(statementId: string): Promise<Statement | undefined> {
  try {
    const statementRef = doc(DB, Collections.statements, statementId);
    const statementDB = await getDoc(statementRef);

    return statementDB.data() as Statement | undefined;
  } catch (error) {
    console.error(error);

    return undefined;
  }
}

export async function getStatementDepth(
  statement: Statement,
  subStatements: Statement[],
  depth: number
): Promise<Statement[]> {
  try {
    const statements: Statement[][] = [[statement]];

    //level 1 is allready in store
    //find second level
    const levleOneStatements: Statement[] = subStatements.filter(
      (s) => s.parentId === statement.statementId && s.statementType === StatementType.result
    );
    statements.push(levleOneStatements);

    //get the next levels

    for (let i = 1; i < depth; i++) {
      const statementsCB = statements[i].map((st: Statement) => getLevelResults(st) as Promise<Statement[]>);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let statementsTemp: any = await Promise.all(statementsCB);

      statementsTemp = statementsTemp.flat(1);

      if (statementsTemp.length === 0) break;

      statements[i + 1] = [];
      statements[i + 1].push(...statementsTemp);
    }

    // @ts-ignore
    const finalStatements: Statement[] = statements.flat(Infinity);

    return finalStatements;
  } catch (error) {
    console.error(error);

    return [];
  }

  async function getLevelResults(statement: Statement): Promise<Statement[]> {
    try {
      const subStatements: Statement[] = [];
      const statementsRef = collection(DB, Collections.statements);
      const q = query(
        statementsRef,
        and(
          where("parentId", "==", statement.statementId),
          or(where("statementType", "==", StatementType.result), where("statementType", "==", StatementType.question))
        )
      );
      const statementsDB = await getDocs(q);

			statementsDB.forEach((doc) => {
				const statement = doc.data() as Statement;
				StatementSchema.parse(statement);

				subStatements.push(statement);
			});

      return subStatements;
    } catch (error) {
      console.error(error);

      return [];
    }
  }
}

export async function getChildStatements(statementId: string): Promise<Statement[]> {
  try {
    const statementsRef = collection(DB, Collections.statements);
    const q = query(
      statementsRef,
      where("statementType", "!=", StatementType.statement),
      where("parents", "array-contains", statementId)
    );
    const statementsDB = await getDocs(q);

		const subStatements = statementsDB.docs.map(
			(doc) => {
				StatementSchema.parse(doc.data());
				
				return doc.data() as Statement
			}
		);

    return subStatements;
  } catch (error) {
    console.error(error);

    return [];
  }
}
