import { Role, StatementSubscription } from "delib-npm";
import { FC } from "react";
import styles from "./membership.module.scss";
import { useLanguage } from "../../../../../../../functions/hooks/useLanguages";

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
    const { t } = useLanguage();

    switch (role) {
        case Role.admin:
            return t("Admin");
        case Role.member:
            return t("Member");
        case Role.banned:
            return t("Banned");
        case Role.unsubscribed:
            return t("Unsubscribed");

        default:
            return t("Member");
    }
}
