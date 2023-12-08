import { useAppSelector } from "./reduxHooks";
import { statementsSubscriptionsSelector } from "../../model/statements/statementsSlice";
import { sortStatementsByHirarrchy } from "../general/sorting";

const useSortStatements = () => {
    const statements = [
        ...useAppSelector(statementsSubscriptionsSelector),
    ].sort((a, b) => b.lastUpdate - a.lastUpdate);

    const _statements = [...statements.map((statement) => statement.statement)];

    const _results = sortStatementsByHirarrchy(_statements);

    return _results;
};

export default useSortStatements;
