import { Results, Statement } from "delib-npm";


export function getResultsByOptions(
    subStatements: Statement[],
    numberOfResults: number
): Results[] {
    try {
        console.log(subStatements);
        console.log(numberOfResults);
        const maxOptions: Statement[] = subStatements
            .filter((s) => s.isOption)
            .sort((b, a) => a.consensus - b.consensus)
            .slice(0, numberOfResults || 1);

        const _maxOptions = maxOptions.map((topStatement: Statement) => ({
            top: topStatement,
            sub: [],
        }));

        return _maxOptions;
    } catch (error) {
        console.error(error);
        return [];
    }
}
