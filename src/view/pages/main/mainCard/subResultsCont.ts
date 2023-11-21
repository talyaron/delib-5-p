import { ResultsType, Statement, StatementType } from "delib-npm"

export function showResult(resultsType: ResultsType, statement: Statement) {
    switch (resultsType) {
        case ResultsType.full:
            return true
        case ResultsType.normal:
            const { statementType } = statement
            if (statementType === StatementType.option || statementType === StatementType.question) return true
            return false
        default:
            return false
    }
}
