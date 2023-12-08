import { FC } from "react";

// Third Party Imports
import { Statement } from "delib-npm";

// Assets
import ThumbDown from "../../../assets/voteDown.svg";
import ThumbUp from "../../../assets/voteUp.svg";
import ThumbDownWhite from "../../../assets/voteDownWhite.svg";
import ThumbUpWhite from "../../../assets/voteUpWhite.svg";

// Statement helpers
import { setEvaluationToDB } from "../../../functions/db/evaluation/setEvaluation";

// Style
import styles from "./Thumbs.module.scss";
import { useAppSelector } from "../../../functions/hooks/reduxHooks";
import { evaluationSelector } from "../../../model/evaluations/evaluationsSlice";


interface ThumbsProps {
    statement: Statement;
    upDown: "up" | "down";
}

const Thumbs: FC<ThumbsProps> = ({ statement, upDown }) => {
    const evaluation = useAppSelector(
        evaluationSelector(statement.statementId)
    );

    const handleVote = () => {
        console.log("handleVote", upDown, evaluation);
        switch (true) {
            case upDown === "up" && evaluation <= 0:
                setEvaluationToDB(statement, 1);
                break;
            case upDown === "down" && evaluation >= 0:
                setEvaluationToDB(statement, -1);

                break;
        }
    };

    if (upDown === "up") {
        if (evaluation > 0) {
            return (
                <div className={styles.pressedRight} onClick={handleVote}>
                    <img src={ThumbUpWhite} alt="vote up" />
                </div>
            );
        } else {
            return (
                <div className={styles.pressRight} onClick={handleVote}>
                    <img src={ThumbUp} alt="vote up" />
                </div>
            );
        }
    } else {
        if (evaluation < 0) {
            return (
                <div className={styles.pressedLeft} onClick={handleVote}>
                    <img src={ThumbDownWhite} alt="vote down" />
                </div>
            );
        } else {
            return (
                <div className={styles.pressLeft} onClick={handleVote}>
                    <img src={ThumbDown} alt="vote down" />
                </div>
            );
        }
    }
};

export default Thumbs;
