import { ResultsType, Statement } from "delib-npm"

export function showResult(resultsType: ResultsType, statement: Statement) {
    switch (resultsType) {
        case ResultsType.full:
            return true
        case ResultsType.normal:
            const { isQuestion, isOption } = statement
            if (isQuestion || isOption) return true
            return false
        default:
            return false
    }
}
