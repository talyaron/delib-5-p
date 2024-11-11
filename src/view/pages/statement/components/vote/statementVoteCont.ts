import { DeliberativeElement, Screen, Statement } from 'delib-npm';

// Updates the displayed options with how many votes each option has from the parent statement
export function setSelectionsToOptions(
	statement: Statement,
	options: Statement[]
) {
	try {
		const parsedOptions = JSON.parse(JSON.stringify(options));
		if (statement.selections) {
			parsedOptions.forEach((option: Statement) => {
				if (statement.selections.hasOwnProperty(`${option.statementId}`)) {
					const optionSelections = statement.selections[option.statementId];
					option.voted = optionSelections;
				}
			});
		}

		return parsedOptions;
	} catch (error) {
		console.error(error);

		return options;
	}
}

export function sortOptionsIndex(
	options: Statement[],
	sort: string | undefined
): Statement[] {
	let _options = JSON.parse(JSON.stringify(options));

	// sort only the order of the options acording to the sort
	switch (sort) {
		case Screen.VOTES_NEW:
			_options = _options.sort((a: Statement, b: Statement) => {
				return b.createdAt - a.createdAt;
			});
			break;

		case Screen.VOTES_CONSENSUS:
			_options = _options.sort((a: Statement, b: Statement) => {
				return b.consensus - a.consensus;
			});
			break;
		case Screen.VOTES_RANDOM:
			_options = _options.sort(() => Math.random() - 0.5);
			break;
		case Screen.VOTESֹֹֹ_VOTED:
			_options = _options.sort((a: Statement, b: Statement) => {
				const aVoted: number = a.voted === undefined ? 0 : a.voted;
				const bVoted: number = b.voted === undefined ? 0 : b.voted;

				return bVoted - aVoted;
			});
			break;
		case Screen.VOTES_UPDATED:
			_options = _options.sort((a: Statement, b: Statement) => {
				return b.lastUpdate - a.lastUpdate;
			});
			break;
		default:
			break;
	}
	_options = _options.map((option: Statement, i: number) => {
		option.order = i;

		return option;
	});
	_options = _options.sort((a: Statement, b: Statement) => {
		return b.createdAt - a.createdAt;
	});

	return _options;
}

export function getTotalVoters(statement: Statement) {
	try {
		const { selections } = statement;

		if (selections) {
			let totalVoters = 0;
			Object.keys(statement.selections).forEach((key: string) => {
				if (key !== 'none') {
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

// TODO: Not used. Delete later
export function getSelections(statement: Statement, option: Statement) {
	try {
		if (
			statement.selections &&
			statement.selections.hasOwnProperty(option.statementId)
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

export const getSiblingOptionsByParentId = (
	parentId: string,
	statements: Statement[]
): Statement[] => {
	return statements.filter((statement) => {
		return (
			statement.parentId === parentId &&
			statement.deliberativeElement === DeliberativeElement.option
		);
	});
};

export const getExistingOptionColors = (options: Statement[]): string[] => {
	const colors = options.flatMap((option: Statement) => option.color ?? []);

	return colors;
};
