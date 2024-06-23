import { Role, StatementSubscription } from "delib-npm";
import { FC } from "react";
import { useLanguage } from "../../../../../../../../controllers/hooks/useLanguages";
import styles from "./MembershipCard.module.scss";

interface Props {
    member: StatementSubscription;
}

const MembershipCard: FC<Props> = ({ member }) => {

	const firstLetter = member.user.displayName.charAt(0).toUpperCase();
	const displayImg = member.user.photoURL
console.log(displayImg)
	return (
		<div className={styles.card}>
			<div className={styles.card__info}>
				<div className={styles.card__info__img} style={{backgroundImage:`url(${displayImg})`}}>{firstLetter}</div>
				<div className={styles.card__info__name}>{member.user.displayName}</div> </div>
			<div className={styles.card__membership}>{member.role} </div>
		
		</div>
	);
};

export default MembershipCard;

const roleToMembershipTitle: Record<Role, string> = {
	[Role.admin]: "Admin",
	[Role.member]: "Member",
	[Role.banned]: "Banned",
	[Role.unsubscribed]: "Unsubscribed",
	[Role.creator]: "Creator",
};
