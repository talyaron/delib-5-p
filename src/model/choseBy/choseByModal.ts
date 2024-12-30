import { ChoseBy, ChoseByEvaluationType, ChoseByType } from "delib-npm";

export function defaultChoseBySettings(statementId: string): ChoseBy {
	return {
		number: 1,
		choseByType: ChoseByType.topOptions,
		choseByEvaluationType: ChoseByEvaluationType.consensus,
		statementId: statementId
	};
}