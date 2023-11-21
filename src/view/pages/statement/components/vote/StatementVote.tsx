import { FC, useEffect, useState } from "react"

// Third party imports
import { Statement } from "delib-npm"
import { useParams } from "react-router-dom"

// Statements components
import StatementOptionsNav from "../options/components/StatementOptionsNav"

// Redux
import { useAppDispatch } from "../../../../../functions/hooks/reduxHooks"

// Statements helpers
import { getToVoteOnParent } from "../../../../../functions/db/vote/getVotes"
import { setVoteToStore } from "../../../../../model/vote/votesSlice"
import NewSetStatementSimple from "../set/NewStatementSimple"
import { setSelectionsToOptions } from "./setSelectionsToOptions"
import { getTotalVoters } from "./getTotalVoters"
import { sortOptionsIndex } from "./sortOptionsIndex"

// Custom components
import Modal from "../../../../components/modal/Modal"
import AddIcon from "@mui/icons-material/Add"
import { OptionBar } from "./OptionBar"
import ScreenFadeInOut from "../../../../components/animation/ScreenFadeInOut"
import { t } from "i18next"

interface Props {
    statement: Statement
    subStatements: Statement[]
}
let getVoteFromDB = false
export const barWidth = 120
export const padding = 10

const StatementVote: FC<Props> = ({ statement, subStatements }) => {
    const dispatch = useAppDispatch()
    const { sort } = useParams()

    const [showModal, setShowModal] = useState(false)

    const __options = subStatements.filter(
        (subStatement: Statement) => subStatement.type === "option"
    )
    const _options = setSelectionsToOptions(statement, __options)
    const options = sortOptionsIndex(_options, sort)
    const totalVotes = getTotalVoters(statement)

    useEffect(() => {
        if (!getVoteFromDB) {
            getToVoteOnParent(statement.statementId, updateStoreWitehVoteCB)
            getVoteFromDB = true
        }
    }, [])

    // useEffect(() => {
    //     setOptions(_options);
    // }, [_options]);

    function updateStoreWitehVoteCB(option: Statement) {
        dispatch(setVoteToStore(option))
    }

    return (
        <ScreenFadeInOut>
            <div className="wrapper">
                <h2>{t("Votes")}</h2>
                <p>
                    {t("Voted")}: {totalVotes}
                </p>
                <div className="statement__vote">
                    {options.map((option: Statement, i: number) => {
                        return (
                            <OptionBar
                                key={option.statementId}
                                order={i}
                                option={option}
                                totalVotes={totalVotes}
                                statement={statement}
                            />
                        )
                    })}
                </div>
            </div>
            <StatementOptionsNav statement={statement} />
            {showModal && (
                <Modal>
                    <NewSetStatementSimple
                        parentStatement={statement}
                        isOption={true}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}
            <div className="fav fav--fixed" onClick={() => setShowModal(true)}>
                <div>
                    <AddIcon
                        style={{
                            transform: `translate(0px,-40%) scale(1.45)`,
                        }}
                    />
                </div>
            </div>
        </ScreenFadeInOut>
    )
}

export default StatementVote
