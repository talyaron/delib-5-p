import { Role, StatementSubscription } from "delib-npm";
import { FC } from "react";
import { useLanguage } from "../../../../../../../../controllers/hooks/useLanguages";
import "./MembershipLine.scss";

interface Props {
    member: StatementSubscription;
}

const MembershipLine: FC<Props> = ({ member }) => {
    const { t } = useLanguage();

    return (
        <div className="membership-line">
            <span>{member.user.displayName} </span>
            <span>({t(roleToMembershipTitle[member.role])})</span>
        </div>
    );
};

export default MembershipLine;

const roleToMembershipTitle: Record<Role, string> = {
    [Role.admin]: "Admin",
    [Role.member]: "Member",
    [Role.banned]: "Banned",
    [Role.unsubscribed]: "Unsubscribed",
    [Role.creator]: "Creator",
};
