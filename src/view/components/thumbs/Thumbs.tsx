import React, { FC, SetStateAction } from "react";

// Third Party Imports
import { Statement } from "delib-npm";

// Assets
import SmileIcon from "../icons/SmileIcon";
import FrownIcon from "../icons/FrownIcon";

// Statement helpers
import { setEvaluationToDB } from "../../../functions/db/evaluation/setEvaluation";

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
                <div onClick={() => handleVote(true)}>
                    <SmileIcon />
                </div>
            );
        } else {
            return (
                <div onClick={() => handleVote(true)}>
                    {" "}
                    <SmileIcon color="lightgray" />
                </div>
            );
        }
    } else {
        if (evaluation < 0) {
            return (
                <div onClick={() => handleVote(false)}>
                    <FrownIcon />
                </div>
            );
        } else {
            return (
                <div onClick={() => handleVote(false)}>
                    <FrownIcon color="lightgray" />
                </div>
            );
        }
    }
};

export default Thumbs;
