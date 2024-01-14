import { Statement } from "delib-npm";

export function getTotalVoters(statement: Statement) {
    try {
        const { selections } = statement;

        if (selections) {
            let totalVoters = 0;
            Object.keys(statement.selections).forEach((key: string) => {
                if (key !== "none") {
                    totalVoters += statement.selections[key];
                }
            });

            return totalVoters;
        }

        return 0;
    } catch (error) {
        console.error(error);

        return 0;
    }
}
