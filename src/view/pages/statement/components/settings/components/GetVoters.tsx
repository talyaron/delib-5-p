import { User, Vote } from "delib-npm";
import React, { FC } from "react";
import { handleGetVoters } from "../statementSettingsCont";
import { useLanguage } from "../../../../../../controllers/hooks/useLanguages";
import MembersChipsList from "./membership/membersChipsList/MembersChipList";

interface GetVotersProps {
    statementId: string;
}

const GetVoters: FC<GetVotersProps> = ({ statementId }) => {
    const { t } = useLanguage();

    const [voters, setVoters] = React.useState<Vote[]>([]);
    const [clicked, setClicked] = React.useState(false);

    const getVoters = () => {
        if (!clicked) {
            handleGetVoters(statementId, setVoters, setClicked);
        } else {
            setClicked(false);
        }
    };

    const members = voters.flatMap((voter) => voter.voter as User);

    return (
        <>
            <button
                type="button"
                className="voters-button form-button"
                onClick={getVoters}
            >
                {t("Get Voters")}
            </button>

            {clicked && (
                <>
                    {members.length > 0 && (
                        <>
                            <span>
                                {voters.length} {t("Voted")}
                            </span>
                            <MembersChipsList members={members} />
                        </>
                    )}
                    {members.length === 0 && <div>{t("No voters found")}</div>}
                </>
            )}
        </>
    );
};

export default GetVoters;
