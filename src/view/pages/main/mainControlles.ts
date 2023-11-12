
import { Results, Statement } from "delib-npm";
import _ from "lodash";


//create a function which sorts an array according to results
export function sortStatementsByHirarrchy(statements: Statement[]): Results[] {
    try {
        console.log(statements)
        //search for tops
        const topStatements = statements.filter(statement => statement.parentId === "top");
        console.log("topStatements", topStatements);
        const results: Results[] = [];
        results.push(...topStatements.map(statement => ({ top: statement, sub: [] })));

        if (results.length === 0) return [];

        //2nd level

        const _results = getNextLevelResults(results, statements);
        console.log(_results)

        _results.forEach((result, i: number) => {
            result.sub?.forEach((sub, j: number) => {
                sub.sub = getNextLevelSubs(sub.top, statements);
            });
        });

        console.log(_results)

        // results.forEach((top, i: number) => {

        //     results[i].sub = getNextLevelSubs(top.top, statements);


        //     //3rd level
        //     // results[i].sub.forEach((sub, j: number) => {
        //     //     results[i].sub[j].sub = getNextLevelSubs(sub.top, statements);
        //     // }
        // });
        console.log(results)




        return results;

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