import { Statement } from "delib-npm";

export function setSelectionsToOptions(
    statement: Statement,
    options: Statement[],
) {
    try {
        const _options = JSON.parse(JSON.stringify(options));
        if (statement.selections) {
            _options.forEach((option: Statement) => {
                if (
                    statement.selections.hasOwnProperty(`${option.statementId}`)
                ) {
                    const optionSelections =
                        statement.selections[option.statementId];
                    option.voted = optionSelections;
                }
            });
        }

        return _options;
    } catch (error) {
        console.error(error);

        return options;
    }
}
