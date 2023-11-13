import { z } from "zod";
import { Results, Statement, StatementSchema } from "delib-npm";
import _ from "lodash";


//create a function which sorts an array according to results
export function sortStatementsByHirarrchy(statements: Statement[]): Results[] {
    try {
        console.log("sortStatementsByHirarrchy");

        const results: Results[] = [];
        if (statements.length === 0) return [];
        let _remainStatements = [...statements];
        let counter = 0;

        while (_remainStatements.length > 0 && counter < 8) {
         
            const { result, remainStatements } = createResult(_remainStatements[0], _remainStatements)
            results.push(result);
            _remainStatements = remainStatements;
            console.log("remain statments", _remainStatements.length)

            counter++;
            console.log('counter', counter)
        }
        console.log(results)
       
        return results;

    } catch (error) {
        console.error(error)
        return [];
    }
}



function createResult(statement: Statement, statements: Statement[]): { result: Results, remainStatements: Statement[] } {
    try {
        const ids = new Set<string>();
        let _statements = [...statements]

        //look for top statements
        ///look for the parent statement of the first statement
        const parentStatement: Statement = findTopParent(statement, _statements);
        ids.add(parentStatement.statementId);
        _statements = _statements.filter(s => s.statementId !== parentStatement.statementId);

        console.log("Parent:",parentStatement.statement)

        const { result, remainStatements } = createResultLevel(parentStatement, _statements);

        return { result, remainStatements };
    } catch (error) {
        console.error(error);
        return { result: { top: statement, sub: [] }, remainStatements: [...statements] }
    };
}

function findTopParent(statement: Statement, statements: Statement[]): Statement {
    try {
        let parentStatement: Statement = statement;
        if (!parentStatement) throw new Error("parentStatement is undefined");
        if (!parentStatement.parentId) throw new Error("parentStatement.parentId is undefined");
        let counter = 0;
        while (parentStatement.parentId !== "top" || counter < 10) {
          
            //search for a parent statement
            const _parentStatement = statements.find(s => s.statementId === parentStatement.parentId);
            if (_parentStatement === undefined) break;
            parentStatement = _parentStatement;
            counter++;
            console.log(counter);
        }

        return parentStatement;
    } catch (error) {
        console.error(error);
        return statement;
    }
}

function createResultLevel(statement: Statement, statements: Statement[]): { result: Results, remainStatements: Statement[] } {
    try {

        const ids = new Set<string>();
        ids.add(statement.statementId);

        const subs = statements.filter(s => s.parentId === statement.statementId);
        const _subs: Results[] = subs.map(sub => createResultLevel(sub, statements).result);
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
