import { Role, StatementSubscription } from "delib-npm";
import { FC, useState, useEffect } from "react";
import styles from "./MembershipCard.module.scss";

//icons
import MemberAdmin from "@/assets/icons/memberAdmin.svg?react";
import MemberRemove from "@/assets/icons/memberRemove.svg?react";
import { useAppSelector } from "@/controllers/hooks/reduxHooks";
import { userSelector } from "@/model/users/userSlice";
import { updateMemberRole } from "@/controllers/db/subscriptions/setSubscriptions";
import unBlockImg from "@/assets/icons/Icon-base-46px.png";

interface Props {
	member: StatementSubscription;
}

const MembershipCard: FC<Props> = ({ member }) => {
	const firstLetter = member.user.displayName.charAt(0).toUpperCase();
	const displayImg = member.user.photoURL;
	const [role, setRole] = useState(member.role);
	const user = useAppSelector(userSelector);

	useEffect(() => {
		setRole(member.role);
	}, [member.role]);

	if (member.userId === user?.uid) return null;

	async function handleRemoveMember() {
		const newRole = role === Role.banned ? Role.member : Role.banned;
		try {
			await updateMemberRole(member.statementId, member.userId, newRole);
			setRole(newRole);
		} catch (error) {
			console.error('Error removing member:', error);
		}
	}

	async function handleSetRole() {
		try {
			const newRole = role === Role.admin ? Role.member : Role.admin;
			await updateMemberRole(member.statementId, member.userId, newRole);
			setRole(newRole);
		} catch (error) {
			console.error('Error setting role:', error);
		}
	}

	const isBanned = role === Role.banned;
	const isAdmin = role === Role.admin;

	return (
		<div className={`${styles.card} ${isBanned ? styles.banned : ""}`}>
			<div className={styles.card__info}>
				<div
					className={`${styles.card__info__img} ${isBanned ? styles.bannedImg : ""}`}
					style={{ backgroundImage: `url(${displayImg})` }}
				>
					{!displayImg && firstLetter}
				</div>
				<div className={`${styles.card__info__name} ${isBanned ? styles.bannedText : ""}`}>{member.user.displayName}</div>
			</div>
			<div className={styles.card__membership}>
				{isBanned ? (
					<button onClick={handleRemoveMember}>
						<img src={unBlockImg} alt="Unblock" className={styles.unBlockImg} />
					</button>
				) : (
					<>
						<button
							role="button"
							onClick={handleSetRole}
							className={`${styles["card__membership--admin"]} ${isAdmin ? styles.admin : ""}`}
						>
							<MemberAdmin />
						</button>
						<button
							onClick={handleRemoveMember}
							className={styles["card__membership--remove"]}
						>
							<MemberRemove />
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default MembershipCard;
