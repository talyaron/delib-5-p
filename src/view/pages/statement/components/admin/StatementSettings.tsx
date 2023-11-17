import { FC, useEffect, useState } from "react"

// Statment imports
import { StatementType } from "../../../../../model/statements/statementModel"
import { setStatmentToDB } from "../../../../../functions/db/statements/setStatments"
import { navArray } from "../nav/StatementNav"

// Third party imports
import { useNavigate, useParams } from "react-router-dom"
import {
    UserSchema,
    User,
    StatementSubscription,
    ResultsBy,
    Screen,
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
import { userSelector } from "../../../../../model/users/userSlice"

// Firestore functions
import {
    getStatementFromDB,
    listenToMembers,
} from "../../../../../functions/db/statements/getStatement"

// Mui
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import { store } from "../../../../../model/store"
import {
    parseScreensCheckBoxes,
    isSubPageChecked,
} from "./statementSettingsCont"
import ScreenFadeInOut from "../../../../components/animation/ScreenFadeInOut"

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
    const user: User | null = useAppSelector(userSelector)

    // Use State
    const [isLoading, setIsLoading] = useState(false)

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

    async function handleSetStatment(ev: React.FormEvent<HTMLFormElement>) {
        try {
            ev.preventDefault()
            setIsLoading(true)
            const data = new FormData(ev.currentTarget)

            let title: any = data.get("statement")
            const resultsBy = data.get("resultsBy") as ResultsBy

            const description = data.get("description")
            //add to title * at the beggining
            if (title && !title.startsWith("*")) title = `*${title}`
            const _statement = `${title}\n${description}`

            UserSchema.parse(user)

            const newStatement: any = Object.fromEntries(data.entries())

            newStatement.subScreens = parseScreensCheckBoxes(
                newStatement,
                navArray
            )
            newStatement.statement = _statement
            newStatement.statementId =
                statement?.statementId || crypto.randomUUID()
            newStatement.creatorId =
                statement?.creator.uid || store.getState().user.user?.uid
            newStatement.parentId = statement?.parentId || statementId || "top"
            newStatement.topParentId =
                statement?.topParentId || statementId || "top"
            newStatement.type =
                statementId === undefined
                    ? StatementType.GROUP
                    : StatementType.STATEMENT
            newStatement.creator = statement?.creator || user
            newStatement.results = {
                resultsBy: resultsBy || ResultsBy.topVote,
                deep: 1,
                minConsensus: 0,
            }
            newStatement.hasChildren =
                newStatement.hasChildren === "on" ? true : false
            if (statement) {
                newStatement.lastUpdate = new Date().getTime()
            }
            newStatement.createdAt =
                statement?.createdAt || new Date().getTime()

            newStatement.consensus = statement?.consensus || 0

            const setSubsciption: boolean =
                statementId === undefined ? true : false

            //remove all "on" values
            for (const key in newStatement) {
                if (newStatement[key] === "on") delete newStatement[key]
            }

            const _statementId = await setStatmentToDB(
                newStatement,
                setSubsciption
            )

            if (_statementId) navigate(`/home/statement/${_statementId}/chat`)
            else throw new Error("statement not found")
        } catch (error) {
            console.error(error)
        }
    }

    const arrayOfStatementParagrphs = statement?.statement.split("\n") || []
    //get all elements of the array except the first one
    const description = arrayOfStatementParagrphs?.slice(1).join("\n")
    const resultsBy: ResultsBy =
        statement?.results?.resultsBy || ResultsBy.topVote
    const hasChildren: boolean = (() => {
        if (!statement) return true
        if (statement.hasChildren === undefined) return true
        return statement.hasChildren
    })()

    return (
        <ScreenFadeInOut>
            {!isLoading ? (
                <form
                    onSubmit={handleSetStatment}
                    className="setStatement__form"
                >
                    <label htmlFor="statement">
                        <input
                            autoFocus={true}
                            type="text"
                            name="statement"
                            placeholder="כותרת הקבוצה"
                            defaultValue={arrayOfStatementParagrphs[0]}
                        />
                    </label>
                    <div>
                        <textarea
                            name="description"
                            placeholder="תיאור הקבוצה"
                            rows={3}
                            defaultValue={description}
                        ></textarea>
                    </div>
                    {!simple ? (
                        <section>
                            <label htmlFor="subPages">לשוניות</label>
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
                                            label={navObj.name}
                                        />
                                    ))}
                            </FormGroup>
                            <label htmlFor="subPages"> מתקדם</label>
                            <FormGroup>
                                <FormControlLabel
                                    key={"sub-statements"}
                                    control={
                                        <Checkbox
                                            name="hasChildren"
                                            defaultChecked={hasChildren}
                                        />
                                    }
                                    label={"לאפשר תת-שיחות"}
                                />
                            </FormGroup>
                        </section>
                    ) : null}

                    <select name="resultsBy" defaultValue={resultsBy}>
                        <option value={ResultsBy.topVote}>
                            תוצאות ההצבעה{" "}
                        </option>
                        <option value={ResultsBy.topOptions}>
                            אופציה מועדפת
                        </option>
                    </select>

                    <div className="btnBox">
                        <button type="submit">
                            {!statementId ? "הוספה" : "עדכון"}
                        </button>
                    </div>
                    <h2>חברים בקבוצה</h2>
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
                    <h2>מעדכן...</h2>
                    <Loader />
                </div>
            )}
        </ScreenFadeInOut>
    )
}
