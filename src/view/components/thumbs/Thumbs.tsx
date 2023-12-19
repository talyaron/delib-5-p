import React, { FC, SetStateAction } from "react";

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

interface ThumbsProps {
    evaluation: number;
    upDown: "up" | "down";
    statement: Statement;
    setConVote: React.Dispatch<SetStateAction<number>>;
    setProVote: React.Dispatch<SetStateAction<number>>;
}

const Thumbs: FC<ThumbsProps> = ({
    evaluation,
    upDown,
    statement,
    setConVote,
    setProVote,
}) => {
    const handleVote = (isUp: boolean) => {
        if (isUp) {
            if (evaluation > 0) {
                // Set evaluation in DB
                setEvaluationToDB(statement, 0);
                // if evaluation is 0 user didn't vote yet so don't do anything
                if (evaluation === 0) return;
                // Set local state
                setProVote((prev) => prev - 1);
            } else {
                setEvaluationToDB(statement, 1);
                setProVote((prev) => prev + 1);
                if (evaluation === 0) return;
                setConVote((prev) => prev - 1);
            }
        } else {
            if (evaluation < 0) {
                setEvaluationToDB(statement, 0);

                if (evaluation === 0) return;
                setConVote((prev) => prev - 1);
            } else {
                setEvaluationToDB(statement, -1);
                setConVote((prev) => prev + 1);
                if (evaluation === 0) return;
                setProVote((prev) => prev - 1);
            }
        }
    };

    if (upDown === "up") {
        if (evaluation > 0) {
            return (
                <div
                    className={styles.pressedRight}
                    onClick={() => handleVote(true)}
                >
                    <img src={ThumbUpWhite} alt="vote up" />
                </div>
            );
        } else {
            return (
                <div
                    className={styles.pressRight}
                    onClick={() => handleVote(true)}
                >
                    {" "}
                    <img src={ThumbUp} alt="vote up" />
                </div>
            );
        }
    } else {
        if (evaluation < 0) {
            return (
                <div
                    className={styles.pressedLeft}
                    onClick={() => handleVote(false)}
                >
                    <img src={ThumbDownWhite} alt="vote down" />
                </div>
            );
        } else {
            return (
                <div
                    className={styles.pressLeft}
                    onClick={() => handleVote(false)}
                >
                    <img src={ThumbDown} alt="vote down" />
                </div>
            );
        }
    }
};

export default Thumbs;
