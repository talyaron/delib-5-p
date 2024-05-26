import { Statement, StatementType } from "delib-npm";

export function styleSwitch(statement: Statement) {
	const { statementType } = statement;

	switch (statementType) {
	case StatementType.question:
		return "question";
	case StatementType.option:
		return "option";
	case StatementType.result:
		return "result";
	case StatementType.statement:
		return "statement";
	default:
		return "statement";
	}
}
