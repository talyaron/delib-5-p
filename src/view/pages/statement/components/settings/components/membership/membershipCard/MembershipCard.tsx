import { Role, StatementSubscription } from "delib-npm";
import { FC } from "react";
import { useLanguage } from "../../../../../../../../controllers/hooks/useLanguages";
import styles from "./MembershipCard.module.scss";

interface Props {
    member: StatementSubscription;
}

const MembershipCard: FC<Props> = ({ member }) => {


	return (
		<div className={styles.card}>
			<div className={styles.card__info}>
				<div className={styles.card__info__img}></div>
				<div>{member.user.displayName}</div> </div>
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
