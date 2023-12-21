import { Evaluation, Vote } from "delib-npm";
import { StatementSettings } from "./settings/StatementSettings";
import { handleGetEvaluators, handleGetVoters } from "./AdminPageCont";
import { useParams } from "react-router-dom";
import { useState } from "react";

const AdminPage = () => {
    const { statementId } = useParams<{ statementId: string }>();
    const [voters, setVoters] = useState<Vote[]>([]);
    const [evaluators, setEvaluators] = useState<Evaluation[]>([]);

    return (
        <div className="page__main">
            <StatementSettings />

            <section style={{ marginBottom: "100px", textAlign: "center" }}>
                <div className="btns">
                    <div
                        className="btn"
                        onClick={() => handleGetVoters(statementId, setVoters)}
                    >
                        Get Voters
                    </div>
                </div>
                {voters.map((voter, i) => (
                    <p key={voter.voteId}>
                        {voter.voter?.displayName || `anonymous ${i + 1}`}
                    </p>
                ))}
            </section>
            <section style={{ marginBottom: "100px", textAlign: "center" }}>
                <div className="btns">
                    <div className="btn" onClick={()=>handleGetEvaluators(statementId, setEvaluators)}>
                        Get Evaluators
                    </div>
                </div>
                {evaluators.map((evaluator, i) => (
                    <p key={evaluator.evaluationId}>
                        {evaluator.evaluator?.displayName || `anonymous ${i + 1}`}
                    </p>
                ))}
            </section>
        </div>
    );
};

export default AdminPage;
