import { Statement, StatementType } from "delib-npm";

export function styleSwitch(styles: any, statement: Statement) {
    const { statementType } = statement;

    switch (statementType) {
        case StatementType.question:
            return styles.question;
        case StatementType.option:
            return styles.option;
        case StatementType.result:
            return styles.result;
        case StatementType.statement:
            return styles.statement;
        default:
            return styles.general;
    }
}
