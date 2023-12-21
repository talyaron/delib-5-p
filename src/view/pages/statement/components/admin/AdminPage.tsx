import { Vote } from "delib-npm";
import { StatementSettings } from "./settings/StatementSettings";
import { handleGetVoters } from "./AdminPageCont";
import { useParams } from "react-router-dom";
import { useState } from "react";

const AdminPage = () => {
    const { statementId } = useParams<{ statementId: string }>();
    const [voters, setVoters] = useState<Vote[]>([]);

    return (
        <div className="page__main">
            <StatementSettings />
            <div className="btns">
                <div
                    className="btn"
                    onClick={() => handleGetVoters(setVoters, statementId)}
                >
                    Get Voters
                </div>
            </div>
            <section style={{marginBottom:"200px", textAlign:"center"}}>
                {voters.map((voter, i) => (
                    <p key={voter.voteId}>{voter.voter?.displayName||`anonymous ${i+1}`}</p>
                ))}
            </section>
        </div>
    );
};

export default AdminPage;
