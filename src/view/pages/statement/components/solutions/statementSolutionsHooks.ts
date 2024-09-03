import { useState, useEffect } from "react";
import { Statement, QuestionStage, QuestionType } from "delib-npm";
import { useSelector } from "react-redux";
import { myStatementsByStatementIdSelector } from "@/model/statements/statementsSlice";
import { getFirstEvaluationOptions, getSecondEvaluationOptions } from "@/controllers/db/multiStageQuestion/getMultiStageStatements";
import { set } from "node_modules/cypress/types/lodash";


interface Props {
    statement: Statement;
}
interface Output {
    subStatements: Statement[];
    isLoading: boolean;
}
export function useMultiStage({ statement }: Props): Output {
    try {
        const [isLoading, setIsLoading] = useState(false);
        const [subStatements, setSubStatements] = useState<Statement[]>([]);
        const isMultiStage = statement.questionSettings?.questionType === QuestionType.multipleSteps;
        const questionStage = statement.questionSettings?.currentStage || QuestionStage.finished;
        const questionType = statement.questionSettings?.questionType;

        if (questionType !== QuestionType.multipleSteps) {
            return { subStatements: [], isLoading: false };
        }

        const myStatements = useSelector(myStatementsByStatementIdSelector(statement.statementId));

        // useEffect(, [questionStage]);

        return { subStatements, isLoading };
    } catch (error) {
        console.log(error);
        return { subStatements: [], isLoading: false };
    }

}