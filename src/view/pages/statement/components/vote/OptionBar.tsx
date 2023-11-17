import { FC } from "react"
import { Statement } from "delib-npm"
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../functions/hooks/reduxHooks"
import {
    parentVoteSelector,
    setVoteToStore,
} from "../../../../../model/vote/votesSlice"
import { setVote } from "../../../../../functions/db/vote/setVote"
import { barWidth, padding } from "./StatementVote"
import { getSelections } from "./getSelections"

export interface OptionBarProps {
    option: Statement
    totalVotes: number
    statement: Statement
    order: number
}
export const OptionBar: FC<OptionBarProps> = ({
    option,
    totalVotes,
    statement,
    order,
}) => {
    const dispatch = useAppDispatch()
    const vote = useAppSelector(parentVoteSelector(option.parentId))
    const _optionOrder = option.order || 0

    const handlePressButton = () => {
        setVote(option, setVoteCB)
    }
    function setVoteCB(option: Statement) {
        dispatch(setVoteToStore(option))
    }
    const selections: number = getSelections(statement, option)

    return (
        <div
            className="statement__vote__bar"
            style={{
                right: `${(_optionOrder - order) * barWidth}px`,
                width: `${barWidth}px`,
            }}
        >
            <div
                className="statement__vote__bar__column"
                style={{ width: `${barWidth}px` }}
            >
                <div
                    className="statement__vote__bar__column__bar"
                    style={{
                        height: `${(selections / totalVotes) * 100}%`,
                        width: `${barWidth - padding}px`,
                    }}
                >
                    {selections}
                </div>
            </div>
            <div
                style={{ width: `${barWidth - padding}px` }}
                className={
                    vote?.statementId === option.statementId
                        ? "statement__vote__bar__btn statement__vote__bar__btn--selected"
                        : "statement__vote__bar__btn"
                }
                onClick={handlePressButton}
            >
                {option.statement}
            </div>
        </div>
    )
}
