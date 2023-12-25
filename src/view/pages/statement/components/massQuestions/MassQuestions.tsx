import { Statement, StatementType } from "delib-npm";
import { FC } from "react";
import MassQuestionCard from "./components/massQuestion/MassQuestionCard";


interface Props {
    statement: Statement;
    subStatements: Statement[];
}



const MassQuestions: FC<Props> = ({ statement, subStatements }) => {
    const questions = subStatements.filter(
        (sub) => sub.statementType === StatementType.question
    );
   
    return (
        <div className="page__main">
            <div className="wrapper">
                <h2>Questions</h2>

                {questions.map((question) => (
                   
                        <MassQuestionCard key={question.statementId} statement={question} />
                   
                ))}
                <div className="btns">
                    <div className="btn">
                        <span>שליחה</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MassQuestions;
