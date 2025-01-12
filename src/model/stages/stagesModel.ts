import { createStatement } from "@/controllers/db/statements/setStatements"
import { StageType, Statement, StatementType } from "delib-npm"

export function convertToStageTitle(stageType: StageType | undefined): string {
	if (!stageType) return "Unknown"
	switch (stageType) {
		case StageType.explanation:
			return "Explanation"
		case StageType.needs:
			return "Needs"
		case StageType.questions:
			return "Questions"
		case StageType.suggestions:
			return "Suggestions"
		case StageType.summary:
			return "Summary"
		default:
			return "Unknown"
	}
}

export const basicStagesTypes = [StageType.explanation, StageType.needs, StageType.questions, StageType.suggestions, StageType.summary]

export class StageC {
	private stage: Statement | undefined;
	constructor(statement: Statement, stageType: StageType) {
		try {
			const newStage = createStatement({
				text: convertToStageTitle(stageType),
				description: "",
				statementType: StatementType.stage,
				parentStatement: statement,
				stageType: stageType
			})
			if (!newStage) throw new Error("Could not create stage")
			this.stage = newStage;
		} catch (error) {
			console.error(error);
		}
	}

	get getStage() {
		return this.stage;
	}
}