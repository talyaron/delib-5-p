import {FC} from "react";
import { Statement } from "delib-npm";
import ThumbDown from '../../../assets/voteDown.svg';
import ThumbUp from '../../../assets/voteUp.svg';
import ThumbDownWhite from '../../../assets/voteDownWhite.svg';
import ThumbUpWhite from '../../../assets/voteUpWhite.svg';
import { setEvaluation } from "../../../functions/db/evaluation/setEvaluation";
import styles from './Thumbs.module.scss';

interface ThumbsProps {
    evaluation: number
    upDown: "up" | "down";
    statement: Statement
}

const Thumbs: FC<ThumbsProps> = ({ evaluation, upDown, statement }) => {
    if (upDown === "up") {
        if (evaluation > 0) {
            return (
                <div className={styles.pressedRight} onClick={() => setEvaluation(statement, 0)} >
                    <img src={ThumbUpWhite} alt="vote up" />
                </div>
            )
        } else {
            return <div className={styles.pressRight} onClick={() => setEvaluation(statement, 1)}> <img src={ThumbUp} alt="vote up" /></div>
        }
    }
    else {
        if (evaluation < 0) {
            return (<div className={styles.pressedLeft} onClick={() => setEvaluation(statement, 0)} ><img src={ThumbDownWhite} alt="vote down" /></div>)
        }
        else {
            return <div className={styles.pressLeft}  onClick={() => setEvaluation(statement, -1)} ><img src={ThumbDown} alt="vote down" /></div>
        }

    }
}

export default Thumbs;