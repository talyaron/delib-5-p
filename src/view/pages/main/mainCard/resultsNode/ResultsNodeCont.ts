import { Statement, StatementType } from "delib-npm"

export function styleSwitch(styles: any, statement: Statement) {
    const { isQuestion, isOption } = statement
    if (isQuestion) return styles.question
    if (isOption) return styles.option
    return styles.general
}

export function isShow(statement: Statement, resultsType: StatementType[]) {
    const { isQuestion, isOption } = statement
    return (
        (resultsType.includes(StatementType.question) && isQuestion) ||
        (resultsType.includes(StatementType.option) && isOption)
    )
}
