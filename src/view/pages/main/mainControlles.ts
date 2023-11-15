
import { Results, Statement } from "delib-npm";


interface ResultLevel {
    result: Results,
    remainStatements: Statement[]
}


//create a function which sorts an array according to results
export function sortStatementsByHirarrchy(statements: Statement[]): Results[] {
    try {

        const results: Results[] = [];
        if (statements.length === 0) return [];

        let _statements = [...statements];

        let counter = 0;
        while (_statements.length > 0 && counter < 8) {

            //take firs statement
            const statement = _statements[0];

            //find top parent statement
            const parentStatement = findMostTopStatement(statement, _statements);
            const { result, remainStatements } = createResultLevel(parentStatement, _statements);
            _statements = remainStatements;

            //add result to results
            results.push(result);
            counter++;
        }

        return results;

    } catch (error) {
        console.error(error)
        return [];
    }
}

function findMostTopStatement(statement: Statement, statements: Statement[],maxLevels:number = 10): Statement {
    try {
        let counter = 0;
        let  parentStatement:Statement|undefined = statement
        while (counter < maxLevels) {
            parentStatement = statements.find(s => s.statementId === statement.parentId);
            if (!parentStatement) return statement;
            statement = parentStatement;
            counter++;
        }
        return parentStatement;
    } catch (error) {
        console.error(error)
        return statement;
    }
}


function createResultLevel(statement: Statement, statements: Statement[]): ResultLevel {
    try {

        const ids = new Set<string>();
        ids.add(statement.statementId);

        const subs = statements.filter(s => s.parentId === statement.statementId).sort((b, a) => b.lastUpdate - a.lastUpdate);
        const _subs: Results[] = subs.map(sub => createResultLevel(sub, statements).result);

        // remove subs from statements
        subs.forEach(sub => ids.add(sub.statementId));
        const remainStatements = statements.filter(s => !ids.has(s.statementId));

        return {
            result: { top: statement, sub: _subs },
            remainStatements
        };
    } catch (error) {
        console.error(error);
        return { result: { top: statement, sub: [] }, remainStatements: statements };
    }
}


