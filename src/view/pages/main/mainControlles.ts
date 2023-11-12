
import { Results, Statement } from "delib-npm";
import _ from "lodash";


//create a function which sorts an array according to results
export function sortStatementsByHirarrchy(statements: Statement[]): Results[] {
    try {
        //1st level
        //search for tops
        const topStatements = statements.filter(statement => statement.parentId === "top");
       
        const results: Results[] = [];
        results.push(...topStatements.map(statement => ({ top: statement, sub: [] })));

        if (results.length === 0) return [];

        //2nd and 3rd level

        const _results = getNextLevelResults(results, statements);
      

        _results.forEach((result) => {
            result.sub?.forEach((sub) => {
                sub.sub = getNextLevelSubs(sub.top, statements);
            });
        });

        return _results;

    } catch (error) {
        console.error(error)
        return [];
    }
}

function getNextLevelResults(results: Results[], statements: Statement[]): Results[] {
    try {
        results.forEach((result, i: number) => {
            results[i].sub = getNextLevelSubs(result.top, statements);
        });
        return results;
        
    } catch (error) {
        console.error(error)
        return [];
    }
}


function getNextLevelSubs(statement: Statement, statements: Statement[]): Results[] {
    try {
        const subs: Results[] = statements.filter(s => s.parentId === statement.statementId).map(statement => ({ top: statement, sub: [] }));
        return subs;
    } catch (error) {
        console.error(error)
        return [];
    }
}