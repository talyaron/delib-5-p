import { DeliberativeElement, Statement } from "delib-npm";
import { setSelectionsToOptions, sortOptionsIndex } from "../../statementVoteCont";

export function isVerticalOptionBar(width: number, optionsCount: number) {
	if (width < 350 && optionsCount >= 4) {
		return false;
	}

	if (width < 90 * optionsCount) {
		return false;
	}

	return true;
}

interface GetVotingOptionsParams {
    statement: Statement;
    subStatements: Statement[];
    sort: string | undefined;
}

export const getSortedVotingOptions = ({
	statement,
	subStatements,
	sort,
}: GetVotingOptionsParams): Statement[] => {
	const options = subStatements.filter((subStatement: Statement) =>
		subStatement.deliberativeElement === DeliberativeElement.option
	);
	const optionsWithSelections = setSelectionsToOptions(statement, options);

	return sortOptionsIndex(optionsWithSelections, sort);
};