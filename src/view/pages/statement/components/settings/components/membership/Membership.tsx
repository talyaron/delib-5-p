import { Access, Statement, StatementSubscription } from "delib-npm";
import { FC } from "react";
import { useLanguage } from "../../../../../../../functions/hooks/useLanguages";
import { useAppSelector } from "../../../../../../../functions/hooks/reduxHooks";
import { statementMembershipSelector } from "../../../../../../../model/statements/statementsSlice";
import ShareIcon from "../../../../../../components/icons/ShareIcon";
import MembershipLine from "./MembershipLine";
import GetVoters from "../GetVoters";
import GetEvaluators from "../GetEvaluators";

//styles
import styles from "./membership.module.scss";
import { handleShare } from "../../statementSettingsCont";
import GroupAccess from "../../../../../../components/groupAccess/GroupAccess";

interface Props {
    statement: Statement | undefined;
}

const Membership: FC<Props> = ({ statement }) => {
    const { languageData } = useLanguage();

    const membership: StatementSubscription[] = useAppSelector(
        statementMembershipSelector(statement?.statementId),
    );

    return (
        <div>
            <h2>Membeship</h2>
            <h3>Type of membership</h3>
            <GroupAccess access={statement?.membership?.access || Access.open} />
            {membership && statement && (
                <>
                    <h2>{languageData["Members in Group"]}</h2>

                    <div
                        className={styles.linkAnonymous}
                        onClick={() => handleShare(statement)}
                    >
                        {languageData["Send a link to anonymous users"]}
                        <ShareIcon />
                    </div>

                    <div className="settings__membersBox">
                        {membership.map((member) => (
                            <MembershipLine
                                key={member.userId}
                                member={member}
                            />
                        ))}
                    </div>

                    <b>{membership.length} Members</b>
                </>
            )}

            <GetVoters statementId={statement?.statementId} />

            <GetEvaluators statementId={statement?.statementId} />
        </div>
    );
};

export default Membership;
