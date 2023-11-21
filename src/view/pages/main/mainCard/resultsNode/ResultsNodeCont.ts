import { Statement, StatementType } from "delib-npm"

export function styleSwitch(styles: any, statement: Statement) {
    const { statementType } = statement
    if (statementType === StatementType.question) return styles.question
    if (statementType === StatementType.option) return styles.option
    return styles.general
}

export function isShow(statement: Statement, resultsType: StatementType[]) {
    const { statementType } = statement
    const isQuestion = statementType === StatementType.question
    const isOption = statementType === StatementType.option
    return (
        (resultsType.includes(StatementType.question) && isQuestion) ||
        (resultsType.includes(StatementType.option) && isOption)
    )
}
