import { FC } from "react";

// Third party imports
import { useParams } from "react-router-dom";
import { StatementSubscription, Statement } from "delib-npm";

// Redux Store
import { useAppSelector } from "@/controllers/hooks/reduxHooks";

// Custom components
import MembershipLine from "./membershipCard/MembershipCard";
import ShareIcon from "@/assets/icons/shareIcon.svg?react";

// Hooks & Helpers
import { useLanguage } from "@/controllers/hooks/useLanguages";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/model/store";
import { StatementSettingsProps } from "../../settingsTypeHelpers";
import "./MembersSettings.scss";

const MembersSettings: FC<StatementSettingsProps> = ({ statement }) => {
	// * Hooks * //
	const { statementId } = useParams();
	const { t } = useLanguage();

	const statementMembershipSelector = (statementId: string | undefined) =>
		createSelector(
			(state: RootState) => state.statements.statementMembership, // Replace with your actual state selector
			(memberships) =>
				memberships.filter(
					(membership: StatementSubscription) =>
						membership.statementId === statementId,
				),
		);

	const members: StatementSubscription[] = useAppSelector(
		statementMembershipSelector(statementId),
	);

	if (!members) return null;

	function handleShare(statement: Statement | undefined) {
		const baseUrl = window.location.origin;

		const shareData = {
			title: t("Delib: We create agreements together"),
			text: t("Invited:") + statement?.statement,
			url: `${baseUrl}/statement-an/true/${statement?.statementId}/options`,
		};
		navigator.share(shareData);
	}

	return (
		<div className="members-settings">
			<button
				className="link-anonymous"
				onClick={() => handleShare(statement)}
			>
				{t("Send a link to anonymous users")}
				<ShareIcon />
			</button>

			<div className="title">
				{t("Joined members")} ({members.length})
			</div>
			<div className="members-box">
				{members.map((member) => (
					<MembershipLine key={member.userId} member={member} />
				))}
			</div>
		</div>
	);
};

export default MembersSettings;
