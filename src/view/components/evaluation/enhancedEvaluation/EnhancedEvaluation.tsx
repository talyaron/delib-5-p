import { Statement } from "delib-npm";
import { FC } from "react";
import styles from "./EnhancedEvaluation.module.scss";
import evaluation1 from "../../../../assets/icons/evaluation/evaluation1.svg";
import evaluation2 from "../../../../assets/icons/evaluation/evaluation2.svg";
import evaluation3 from "../../../../assets/icons/evaluation/evaluation3.svg";
import evaluation4 from "../../../../assets/icons/evaluation/evaluation4.svg";
import evaluation5 from "../../../../assets/icons/evaluation/evaluation5.svg";
import { setEvaluationToDB } from "../../../../functions/db/evaluation/setEvaluation";

interface EnhancedEvaluationProps {
    statement: Statement;
}

interface Evaluation {
    evaluation: number;
    svg: string;
    color: string;
}

const evaluations:Evaluation[] = [
    { evaluation: 1, svg: evaluation1, color: "#70CB9F" },
    { evaluation: 0.5, svg: evaluation2, color: "#67B8D1" },
    { evaluation: 0, svg: evaluation3, color: "#E7D080" },
    { evaluation: -0.5, svg: evaluation4, color: "#F6AE92" },
    { evaluation: -1, svg: evaluation5, color: "#FC8C9B" },
];

const EnhancedEvaluation: FC<EnhancedEvaluationProps> = ({statement}) => {

    function handleSetEvaluation(evaluation:number){
        setEvaluationToDB(statement, evaluation);

    }
    return <div className={styles.container}>
        {evaluations.map((evaluation) => <div onClick={()=>handleSetEvaluation(evaluation.evaluation)} style={{backgroundColor:evaluation.color}} className={styles.item}>
            <img src={evaluation.svg} alt="like" />
        </div>)}
    </div>;
};

export default EnhancedEvaluation;
