import { Statement } from "delib-npm";

export interface StatementSettingsProps {
    statement: Statement;
    setStatementToEdit: (statement: Statement) => void;
}
