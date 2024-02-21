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
    const { languageData } = useLanguage();

    switch (role) {
        case Role.admin:
            return languageData["Admin"];
        case Role.member:
            return languageData["Member"];
        case Role.banned:
            return languageData["Blocked"];
        case Role.parentAdmin:
            return languageData["Parent Admin"];
        case Role.guest:
            return languageData["Guest"];

        default:
            return languageData["Member"];
    }
}
