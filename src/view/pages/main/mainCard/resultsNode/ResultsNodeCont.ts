import { Statement, StatementType } from "delib-npm"

export function styleSwitch(styles: any, statement: Statement) {
    const { statementType } = statement
    if (statementType === StatementType.question) return styles.question
    if (statementType === StatementType.option) return styles.option
    if (statementType === StatementType.result) return styles.result
    return styles.general
}


