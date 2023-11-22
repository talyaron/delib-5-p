import { FC, useEffect, useState } from "react"
import Slider from "@mui/material/Slider"

// Statment imports
import { navArray } from "../nav/StatementNav"

// Third party imports
import { useNavigate, useParams } from "react-router-dom"
import {
    StatementSubscription,
    ResultsBy,
    Screen
} from "delib-npm"

// Custom components
import Loader from "../../../../components/loaders/Loader"
import MembershipLine from "./MembershipLine"

// Redux Store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../functions/hooks/reduxHooks"
import {
    removeMembership,
    setMembership,
    setStatement,
    statementMembershipSelector,
    statementSelector,
} from "../../../../../model/statements/statementsSlice"

// Firestore functions
import {
    getStatementFromDB,
    listenToMembers,
} from "../../../../../functions/db/statements/getStatement"

// Mui
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"

import {
    isSubPageChecked,
    handleSetStatment,
} from "./statementSettingsCont"
import ScreenFadeInOut from "../../../../components/animation/ScreenFadeInOut"
import { t } from "i18next"

interface Props {
    simple?: boolean
    new?: boolean
}

export const StatementSettings: FC<Props> = ({ simple }) => {
    const navigate = useNavigate()
    const { statementId } = useParams()

    // Redux
    const dispatch = useAppDispatch()
    const statement = useAppSelector(statementSelector(statementId))
    const membership: StatementSubscription[] = useAppSelector(
        statementMembershipSelector(statementId)
    )

    // Use State
    const [isLoading, setIsLoading] = useState(false)
    const [numOfResults] = useState(
        statement?.resultsSettings?.numberOfResults || 1
    )

    useEffect(() => {
        let unsubscribe: Function = () => {}
        if (statementId) {
            unsubscribe = listenToMembers(
                statementId,
                setMembershipCB,
                removeMembershipCB
            )

            if (!statement)
                (async () => {
                    const statementDB = await getStatementFromDB(statementId)
                    if (statementDB) dispatch(setStatement(statementDB))
                })()
        }
        return () => {
            unsubscribe()
        }
    }, [statementId])

    //CBs
    function setMembershipCB(membership: StatementSubscription) {
        dispatch(setMembership(membership))
    }

    function removeMembershipCB(membership: StatementSubscription) {
        dispatch(removeMembership(membership.statementsSubscribeId))
    }

    

    const arrayOfStatementParagrphs = statement?.statement.split("\n") || []
    //get all elements of the array except the first one
    const description = arrayOfStatementParagrphs?.slice(1).join("\n")
    const resultsBy: ResultsBy =
        statement?.resultsSettings?.resultsBy || ResultsBy.topVote
    const hasChildren: boolean = (() => {
        if (!statement) return true
        if (statement.hasChildren === undefined) return true
        return statement.hasChildren
    })()

    return (
        <ScreenFadeInOut>
            {!isLoading ? (
                <form
                    onSubmit={(e)=>handleSetStatment(e, setIsLoading, statement, statementId, navigate, navArray)}
                    className="setStatement__form"
                >
                    <label htmlFor="statement">
                        <input
                            autoFocus={true}
                            type="text"
                            name="statement"
                            placeholder={t("Group Title")}
                            defaultValue={arrayOfStatementParagrphs[0]}
                        />
                    </label>
                    <div>
                        <textarea
                            name="description"
                            placeholder={t("Group Description")}
                            rows={3}
                            defaultValue={description}
                        ></textarea>
                    </div>
                    {!simple ? (
                        <section>
                            <label htmlFor="subPages">{t("Tabs")}</label>
                            <FormGroup>
                                {navArray
                                    .filter(
                                        (navObj) =>
                                            navObj.link !== Screen.SETTINGS
                                    )
                                    .map((navObj) => (
                                        <FormControlLabel
                                            key={navObj.id}
                                            control={
                                                <Checkbox
                                                    name={navObj.link}
                                                    defaultChecked={isSubPageChecked(
                                                        statement,
                                                        navObj
                                                    )}
                                                />
                                            }
                                            label={t(navObj.name)}
                                        />
                                    ))}
                            </FormGroup>
                            <label htmlFor="subPages">{t("Advanced")}</label>
                            <FormGroup>
                                <FormControlLabel
                                    key={"sub-statements"}
                                    control={
                                        <Checkbox
                                            name="hasChildren"
                                            defaultChecked={hasChildren}
                                        />
                                    }
                                    label={t("Enable Sub-Conversations")}
                                />
                            </FormGroup>
                        </section>
                    ) : null}

                    <select name="resultsBy" defaultValue={resultsBy}>
                        <option value={ResultsBy.topVote}>
                            {t("Voting Results")}
                        </option>
                        <option value={ResultsBy.topOptions}>
                            {t("Favorite Option")}
                        </option>
                    </select>
                    <br></br>
                    <label>{t("Number of Results to Display")}</label>
                    <Slider
                        defaultValue={numOfResults}
                        min={1}
                        max={10}
                        valueLabelDisplay="on"
                        name={"numberOfResults"}
                        style={{ width: "95%" }}
                    />

                    <div className="btnBox">
                        <button type="submit">
                            {!statementId ? t("Add") : t("Update")}
                        </button>
                    </div>
                    <h2>{t("Members in Group")}</h2>
                    {membership && (
                        <div>
                            {membership.map((member) => (
                                <MembershipLine
                                    key={member.userId}
                                    member={member}
                                />
                            ))}
                        </div>
                    )}
                </form>
            ) : (
                <div className="center">
                    <h2>{t("Updating")}</h2>
                    <Loader />
                </div>
            )}
        </ScreenFadeInOut>
    )
}
