import { createSelector } from "@reduxjs/toolkit";
import {
	Role,
	StatementSubscription,
	Statement,
	Collections,
	Access,
	membersAllowed,
} from "delib-npm";
import { collection, getDocs } from "firebase/firestore";
import { Dispatch, FC, useEffect, useState } from "react";

// Third party imports
import { useParams } from "react-router-dom";

// Redux Store
import { FireStore } from "../../../../../../../controllers/db/config";
import SetWaitingList from "../../../../../../../controllers/db/waitingList/SetWaitingList";
import MembershipLine from "./membershipCard/MembershipCard";
import ShareIcon from "@/assets/icons/shareIcon.svg?react";
import { useAppSelector } from "@/controllers/hooks/reduxHooks";

// Custom components

// Hooks & Helpers
import { useLanguage } from "@/controllers/hooks/useLanguages";
import { RootState } from "@/model/store";
import "./MembersSettings.scss";
import Checkbox from "@/view/components/checkbox/Checkbox";

interface MembersSettingsProps {
  statement: Statement;
  setStatementToEdit: Dispatch<Statement>;
}

const MembersSettings: FC<MembersSettingsProps> = ({
	statement,
	setStatementToEdit,
}) => {
	// * Hooks * //
	const { statementId } = useParams();
	const { t } = useLanguage();
	const [userCount, setUserCount] = useState<number>(0);

	const statementMembershipSelector = (statementId: string | undefined) =>
		createSelector(
			(state: RootState) => state.statements.statementMembership, // Replace with your actual state selector
			(memberships) =>
				memberships.filter(
					(membership: StatementSubscription) =>
						membership.statementId === statementId
				)
		);

	const members: StatementSubscription[] = useAppSelector(
		statementMembershipSelector(statementId)
	);

	if (!members) return null;

	const joinedMembers = members.filter((member) => member.role !== Role.banned);
	const bannedUser = members.filter((member) => member.role === Role.banned);

	function handleShare(statement: Statement | undefined) {
		const baseUrl = window.location.origin;

		const shareData = {
			title: t("FreeDi: Empowering Agreements"),
			text: t("Invited:") + statement?.statement,
			url: `${baseUrl}/statement-an/true/${statement?.statementId}/options`,
		};
		navigator.share(shareData);
	}

	function handleOpenGroup() {
		setStatementToEdit({
			...statement,
			membership: {
				...statement.membership,
				access:
          statement.membership?.access === Access.open
          	? Access.close
          	: Access.open,
			},
		});
	}

	function handleAllowAnonymous() {
		setStatementToEdit({
			...statement,
			membership: {
				...statement.membership,
				typeOfMembersAllowed:
          statement.membership?.typeOfMembersAllowed ===
          membersAllowed.nonAnonymous
          	? membersAllowed.all
          	: membersAllowed.nonAnonymous,
			},
		});
	}

	const fetchAwaitingUsers = async (): Promise<void> => {
		const usersCollection = collection(FireStore, Collections.awaitingUsers);
		const usersSnapshot = await getDocs(usersCollection);
		const count = usersSnapshot.docs.length;
		
		return setUserCount(count);
	};

	useEffect(() => {
		fetchAwaitingUsers();
	}, []);

	return (
		<div className="members-settings">
			<Checkbox
				name="openGroup"
				label="Open Group"
				isChecked={statement.membership?.access === Access.open}
				toggleSelection={handleOpenGroup}
			/>
			<Checkbox
				name="allowAnonymous"
				label="Allow Anonymous users"
				isChecked={
					statement.membership?.typeOfMembersAllowed === membersAllowed.all
				}
				toggleSelection={handleAllowAnonymous}
			/>
			<button className="link-anonymous" onClick={() => handleShare(statement)}>
				{t("Send a link to anonymous users")}
				<ShareIcon />
			</button>
			<div className="upload-waiting-list">
				<SetWaitingList statement={statement} />
			</div>
			<div className="title">
				{t("Joined members")} ({`${userCount}`})
			</div>
			<div className="members-box">
				{joinedMembers.map((member) => (
					<MembershipLine key={member.userId} member={member} />
				))}
			</div>

			<div className="title">
				{t("Banned users")} ({bannedUser.length})
			</div>
			<div className="members-box">
				{bannedUser.map((member) => (
					<MembershipLine key={member.userId} member={member} />
				))}
			</div>
		</div>
	);
};

export default MembersSettings;
