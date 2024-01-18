import { Role, StatementSubscription } from "delib-npm";
import { FC } from "react";
import styles from "./membership.module.scss";
import { t } from "i18next";

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
            return t("Admin");
        case Role.member:
            return t("Member");
        case Role.banned:
            return t("Blocked");
        case Role.parentAdmin:
            return t("Parent Admin");
        case Role.guest:
            return t("Guest");

        default:
            return t("Member");
    }
}
