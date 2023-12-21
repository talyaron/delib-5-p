import { Evaluation, Vote } from "delib-npm";
import { StatementSettings } from "./settings/StatementSettings";
import { handleGetEvaluators, handleGetVoters } from "./AdminPageCont";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Avatar, Chip } from "@mui/material";
import anonymous from "../../../../../assets/anonymous1.png";
import styles from "./AdminPage.module.scss";

const AdminPage = () => {
    const { statementId } = useParams<{ statementId: string }>();
    const [voters, setVoters] = useState<Vote[]>([]);
    const [evaluators, setEvaluators] = useState<Evaluation[]>([]);

    return (
        <div className="page__main">
            <StatementSettings />

            <section className={styles.section}>
                <div className="btns">
                    <div
                        className="btn"
                        onClick={() => handleGetVoters(statementId, setVoters)}
                    >
                        Get Voters
                    </div>
                </div>
                <div className={styles.chips}>
                {voters.map((voter, i) => {
                    const displayName =
                        voter.voter?.displayName.slice(0, 15) ||
                        `anonymous ${i + 1}`;
                    return (
                        <Chip
                            style={{ direction: "ltr" }}
                            key={voter.voteId}
                            avatar={
                                <Avatar
                                    alt={displayName}
                                    src={voter.voter?.photoURL || anonymous}
                                />
                            }
                            label={displayName}
                            variant="outlined"
                        />
                    );
                })}
                </div>
            </section>
            <section className={styles.section}>
                <div className="btns">
                    <div
                        className="btn"
                        onClick={() =>
                            handleGetEvaluators(statementId, setEvaluators)
                        }
                    >
                        Get Evaluators
                    </div>
                </div>
                <div className={styles.chips}>
                    {evaluators.map((evaluator, i) => {
                        const displayName =
                            evaluator.evaluator?.displayName.slice(0, 15) ||
                            `anonymous ${i + 1}`;
                        return (
                            <Chip
                                style={{ direction: "ltr" }}
                                key={evaluator.evaluationId}
                                avatar={
                                    <Avatar
                                        alt={displayName}
                                        src={
                                            evaluator.evaluator?.photoURL ||
                                            anonymous
                                        }
                                    />
                                }
                                label={displayName}
                                variant="outlined"
                            />
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default AdminPage;
