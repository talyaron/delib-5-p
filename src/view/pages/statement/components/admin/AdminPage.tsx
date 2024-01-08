import { Evaluation, Vote } from "delib-npm";
import { handleGetEvaluators, handleGetVoters } from "./AdminPageCont";
import { useParams } from "react-router-dom";
import { useState } from "react";

import styles from "./AdminPage.module.scss";
import Chip from "../../../../components/chip/Chip";
import { StatementSettings } from "../settings/StatementSettings";

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
                    {voters.map((voter) => {
                        
                        return (
                            <Chip
                              
                                key={voter.voteId}
                                user={voter.voter}
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
                <div className={styles.chips} style={{marginBottom:"150px"}}>
                    {evaluators.map((evaluator) => {
                        return (
                            <Chip
                                key={evaluator.evaluationId}
                                user={evaluator.evaluator}
                                
                            />
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default AdminPage;
