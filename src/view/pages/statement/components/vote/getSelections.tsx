import { Statement } from "delib-npm";

export function getSelections(statement: Statement, option: Statement) {
    try {
        if (
            statement.selections &&
            statement.selections.hasOwnProperty(`${option.statementId}`)
        ) {
            const optionSelections = statement.selections[option.statementId];
            if (!optionSelections) return 0;
            
return optionSelections;
        }
        
return 0;
    } catch (error) {
        console.error(error);
        
return 0;
    }
}
