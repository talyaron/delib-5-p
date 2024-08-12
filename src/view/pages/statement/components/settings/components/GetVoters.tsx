import { StatementSubscription, Vote } from "delib-npm";
import React from "react";
import { getVoters } from "../../../../../../functions/db/vote/getVotes";
import Chip from "../../../../../components/chip/Chip";
import { handleGetVoters } from "../statementSettingsCont";
import { votesArray } from './../../nav/bottom/StatementBottomNavModal';

interface GetVotersProps {
    statementId: string | undefined;
    showNonVoters: boolean;
    membership: StatementSubscription[]; // Add this line
}

export default function GetVoters({
    statementId,
    showNonVoters,
    membership, // Add this line
}: GetVotersProps) {
    const [voters, setVoters] = React.useState<Vote[]>([]);
    const [clicked, setClicked] = React.useState(false);
    const [nonVoters, setNonVoters] = React.useState<StatementSubscription[]>([]);
    const [showNonVotersState, setShowNonVoters] = React.useState(showNonVoters);

    const fetchVoters = async () => {
        if (!statementId) return;
        await handleGetVoters(statementId, setVoters, setClicked);
    };

    const fetchNonVoters = async () => {
        if (!statementId) return;

        const votersList = await getVoters(statementId);

        if (!votersList || !membership) {
            console.error("Voters list or membership is undefined.");

            return;
        }

        const nonVotersList = membership.filter((member) =>
            !votersList.some((voter) => voter.voter && voter.voter.uid === member.userId)
        );

        setNonVoters(nonVotersList);
        setClicked(true);
        setShowNonVoters(true);
    };

    return (
        statementId && (
            <section className="settings__getUsers">
                <button
                    type="button"
                    className="settings__getUsers__votersBtn formBtn"
                    onClick={fetchVoters}
                >
                    Get Voters
                </button>

                <div className="settings__getUsers__chipBox">
                    {voters.length > 0
                        ? voters.map((voter) => {
                            return (
                                <Chip key={voter.voteId} user={voter.voter} />
                            );
                        })
                        : clicked && !showNonVotersState && (
                            <p style={{ marginTop: 20 }}>No voters found</p>
                        )}
                </div>
                {clicked && !showNonVotersState && <b>{voters.length} Voted</b>}

                <button
                    type="button"
                    className="settings__getUsers__votersBtn formBtn"
                    onClick={fetchNonVoters}
                >
                    Get Non-Voters
                </button>

                {showNonVotersState && (
                    <div className="settings__getUsers__chipBox">
                        {nonVoters.length > 0
                            ? nonVoters.map((nonVoter) => {
                                if (nonVoter.userId) {
                                    return (
                                        <Chip key={nonVoter.user.uid} user={nonVoter.user} />
                                    );
                                }

                                return null;
                            })
                            : clicked && (
                                <p style={{ marginTop: 20 }}>No non-voters found</p>
                            )}
                    </div>
                )}
                {clicked && showNonVotersState && <b>{nonVoters.length} Didn't Vote</b>}
            </section>
        )
    );
}
