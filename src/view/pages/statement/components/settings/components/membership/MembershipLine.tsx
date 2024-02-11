import { Role, StatementSubscription } from "delib-npm";
import { FC } from "react";
import styles from "./membership.module.scss";

interface Props {
    member: StatementSubscription;
}

const MembershipLine: FC<Props> = ({ member }) => {
    return (
        <div className={styles.member}>
            <span>{member.user.displayName} </span>
            <span>{memebershipDictionarty(member.role)}</span>
        </div>
    );
};

export default MembershipLine;

function memebershipDictionarty(role: Role) {
    switch (role) {
        case Role.admin:
            return ("Admin");
        case Role.member:
            return ("Member");
        case Role.banned:
            return ("Blocked");
        case Role.parentAdmin:
            return ("Parent Admin");
        case Role.guest:
            return ("Guest");

        default:
            return ("Member");
    }
}
