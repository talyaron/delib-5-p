import { Statement, StatementType } from "delib-npm";
import { FC } from "react";
import MassQuestionCard from "./components/massQuestion/MassQuestionCard";
import { handleSetAnswersToDB } from "./MassQuestionsCont";

interface Props {
    statement: Statement;
    subStatements: Statement[];
}

const answers:Statement[] = [];

const MassQuestions: FC<Props> = ({ statement, subStatements }) => {
    const questions = subStatements.filter(
        (sub) => sub.statementType === StatementType.question
    );
    console.log(answers)
    return (
        <div className="page__main">
            <div className="wrapper">
                <h2>Questions</h2>

                {questions.map((question, index) => (
                   
                        <MassQuestionCard key={question.statementId} statement={question} answers={answers} index={index} />
                   
                ))}
                <div className="btns">
                    <div className="btn" onClick={()=>handleSetAnswersToDB(answers)}>
                        <span>שליחה</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MassQuestions;
