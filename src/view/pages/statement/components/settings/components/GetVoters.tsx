import { Vote } from "delib-npm";
import React from "react";
import Chip from "../../../../../components/chip/Chip";
import { handleGetVoters } from "../statementSettingsCont";
import { useLanguage } from "../../../../../../functions/hooks/useLanguages";

export default function GetVoters({
    statementId,
}: {
    statementId: string | undefined;
}) {
    const { t } = useLanguage();

    const [voters, setVoters] = React.useState<Vote[]>([]);
    const [clicked, setClicked] = React.useState(false);

    return (
        statementId && (
            <section className="settings__getUsers">
                <button
                    type="button"
                    className="settings__getUsers__votersBtn formBtn"
                    onClick={() =>
                        handleGetVoters(statementId, setVoters, setClicked)
                    }
                >
                    {t("Get Voters")}
                </button>

                <div className="settings__getUsers__chipBox">
                    {voters.length > 0
                        ? voters.map((voter) => {
                              return (
                                  <Chip key={voter.voteId} user={voter.voter} />
                              );
                          })
                        : clicked && (
                              <p style={{ marginTop: 20 }}>
                                  {t("No voters found")}
                              </p>
                          )}
                </div>
                {clicked && <b>{voters.length} Voted</b>}
            </section>
        )
    );
}
