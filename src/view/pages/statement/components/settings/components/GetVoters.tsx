import { StatementSubscription, Vote } from "delib-npm";
import { useState } from "react";
import { getVoters } from "../../../../../../functions/db/vote/getVotes";
import Chip from "../../../../../components/chip/Chip";
import { handleGetVoters } from "../statementSettingsCont";

interface GetVotersProps {
    statementId: string | undefined;
    showNonVoters: boolean;
    membership: StatementSubscription[];
}

export default function GetVoters({
	statementId,
	membership,
}: GetVotersProps) {
	const [voters, setVoters] = useState<Vote[]>([]);
	const [nonVoters, setNonVoters] = useState<StatementSubscription[]>([]);
	const [clickedVoters, setClickedVoters] = useState(false);
	const [clickedNonVoters, setClickedNonVoters] = useState(false);

	const fetchVoters = async () => {
		if (!statementId) return;
		await handleGetVoters(statementId, setVoters, setClickedVoters);
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
		setClickedNonVoters(true);
	};

	return (
		statementId && (
			<section className="settings__getUsers">
				<button
					type="button"
					className="settings__getUsers__votersBtn formBtn"
					onClick={fetchVoters}>
                    Get Voters
				</button>
				<div className="settings__getUsers__chipBox">
					{voters.length > 0
						? voters.map((voter) => (
							<Chip key={voter.voteId} user={voter.voter} />
						))
						: clickedVoters && (
							<p style={{ marginTop: 20 }}>No voters found</p>
						)}
				</div>
				{clickedVoters && <b>{voters.length} Voted</b>}

				<button
					type="button"
					className="settings__getUsers__votersBtn formBtn"
					onClick={fetchNonVoters}>
                    Get Non-Voters
				</button>
				<div className="settings__getUsers__chipBox">
					{nonVoters.length > 0
						? nonVoters.map((nonVoter) => (
							nonVoter.userId ? (
								<Chip key={nonVoter.user.uid} user={nonVoter.user} />
							) : null
						))
						: clickedNonVoters && (
							<p style={{ marginTop: 20 }}>No non-voters found</p>
						)}
				</div>
				{clickedNonVoters && <b>{nonVoters.length} Didn't Vote</b>}
			</section>
		)
	);
}
