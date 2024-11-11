import { DeliberativeElement, Results, Statement } from 'delib-npm';

interface ResultLevel {
	result: Results;
	ids: Set<string>;
}

export enum FilterType {
	all = 'all',
	questionsResults = 'questionsResults',
	questionsResultsOptions = 'questionsResultsOptions',
	questions = 'questions',
}

//create a function which sorts an array according to results
export function sortStatementsByHirarrchy(statements: Statement[]): Results[] {
	try {
		const results: Results[] = [];

		if (statements.length === 0) return [];

		let _statements = [...statements];

		//convert string set to string array

		let counter = 0;
		const ids = new Set<string>();

		while (ids.size < statements.length && counter < 8) {
			//take firs statement
			if (_statements.length === 0) break;
			const statement = _statements[0];

			//find top parent statement
			const parentStatement = findMostTopStatement(statement, _statements);

			const { result, ids: _ids } = createResultLevel(
				parentStatement,
				_statements,
				ids
			);
			_statements = _statements.filter((s) => !_ids.has(s.statementId));

			//add result to results
			results.push(result);
			counter++;
		}

		return results;
	} catch (error) {
		console.error(error);

		return [];
	}
}

function findMostTopStatement(
	statement: Statement,
	statements: Statement[],
	maxLevels = 10
): Statement {
	try {
		if (!statement) throw new Error('statement is undefined');
		let counter = 0;
		let parentStatement: Statement | undefined = statement;

		if (statement.parentId === 'top') return statement;
		while (counter < maxLevels) {
			parentStatement = statements.find(
				(s) => s.statementId === statement.parentId
			);

			if (!parentStatement) return statement;
			statement = parentStatement;
			counter++;
		}

		return parentStatement;
	} catch (error) {
		console.error(error);

		return statement;
	}
}

function createResultLevel(
	statement: Statement,
	statements: Statement[],
	ids: Set<string>
): ResultLevel {
	try {
		const _statements = [...statements];

		ids.add(statement.statementId);

		const subs = _statements
			.filter((s) => s.parentId === statement.statementId)
			.sort((b, a) => b.lastUpdate - a.lastUpdate);
		const results: ResultLevel[] = subs.map((sub) =>
			createResultLevel(sub, statements, ids)
		);

		return {
			result: { top: statement, sub: results.map((r) => r.result) },
			ids,
		};
	} catch (error) {
		console.error(error);

		return { result: { top: statement, sub: [] }, ids };
	}
}

interface Filter {
	types: Array<DeliberativeElement | 'result'>;
}

export function filterByStatementType(filter: FilterType): Filter {
	try {
		switch (filter) {
			case FilterType.all:
				return {
					types: [
						DeliberativeElement.option,
						DeliberativeElement.research,
						'result',
					],
				};
			case FilterType.questionsResults:
				return {
					types: [DeliberativeElement.research, 'result'],
				};
			case FilterType.questionsResultsOptions:
				return {
					types: [
						DeliberativeElement.option,
						DeliberativeElement.research,
						'result',
					],
				};
			case FilterType.questions:
				return {
					types: [DeliberativeElement.research],
				};
			default:
				return {
					types: [
						DeliberativeElement.option,
						DeliberativeElement.research,
						'result',
					],
				};
		}
	} catch (error) {
		console.error(error);

		return {
			types: [
				DeliberativeElement.option,
				DeliberativeElement.research,
				'result',
			],
		};
	}
}
