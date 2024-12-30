import { ChoseBy, ChoseByEvaluationType, CutoffType } from "delib-npm";

export function defaultChoseBySettings(statementId: string): ChoseBy {
	return {
		number: 1,
		CutoffType: CutoffType.topOptions,
		choseByEvaluationType: ChoseByEvaluationType.consensus,
		statementId: statementId
	};
}