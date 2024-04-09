import { FC } from "react";

// Third party imports
import { Statement } from "delib-npm";

// Redux store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../../functions/hooks/reduxHooks";
import {
    parentVoteSelector,
    setVoteToStore,
} from "../../../../../../model/vote/votesSlice";

// Statements helpers
import { setVote } from "../../../../../../functions/db/vote/setVote";
import { getSelections } from "../statementVoteCont";
import { statementTitleToDisplay } from "../../../../../../functions/general/helpers";
import InfoIcon from "../../../../../../assets/icons/infoCircleIcon.svg?react";
import HandIcon from "../../../../../../assets/icons/handIcon.svg?react";

export interface OptionBarProps {
    option: Statement;
    totalVotes: number;
    statement: Statement;
    order: number;
    setStatementInfo: React.Dispatch<React.SetStateAction<Statement | null>>;
    setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
    optionsCount: number;
}
export const VerticalOptionBar: FC<OptionBarProps> = ({
    option,
    totalVotes,
    statement,
    order,
    setStatementInfo,
    setShowInfo,
}) => {
    // * Redux * //
    const dispatch = useAppDispatch();
    const vote = useAppSelector(parentVoteSelector(option.parentId));

    // * Variables * //
    const _optionOrder = option.order || 0;
    const selections: number = getSelections(statement, option);

    const barWidth = 100;

    const padding = 40;
    const { shortVersion } = statementTitleToDisplay(option.statement, 30);
    const barHeight = Math.round((selections / totalVotes) * 100);

    // * Functions * //
    const handlePressButton = () => {
        dispatch(setVoteToStore(option));
        setVote(option);
    };

    return (
        <div
            className="verticalVote__bar"
            style={{
                right: `${(_optionOrder - order) * barWidth}px`,
                width: `${barWidth}px`,
            }}
        >
            <div
                className="verticalVote__bar__column"
                style={{
                    width: `${barWidth}px`,
                }}
            >
                {barHeight > 0 && (
                    <div className="verticalVote__bar__column__stat">
                        <span>{barHeight}%</span>

                        <span>{selections}</span>
                    </div>
                )}
                <div
                    className="verticalVote__bar__column__bar"
                    style={{
                        height: `${barHeight}%`,
                        width: `${barWidth - padding}px`,
                        backgroundColor: option.color,
                    }}
                ></div>
            </div>
            <div className="verticalVote__bar__hand btnShadow">
                <div
                    style={{
                        width: `${barWidth - padding}px`,
                        backgroundColor:
                            vote?.statementId === option.statementId
                                ? option.color
                                : "white",
                    }}
                    className={
                        vote?.statementId === option.statementId
                            ? "verticalVote__bar__btn verticalVote__bar__btn--selected"
                            : "verticalVote__bar__btn"
                    }
                    onClick={handlePressButton}
                >
                    <HandIcon
                        style={{
                            color:
                                vote?.statementId !== option.statementId
                                    ? option.color
                                    : "white",
                        }}
                    />
                </div>
            </div>
            <button
                className="infoIcon"
                onClick={() => {
                    setStatementInfo(option), setShowInfo(true);
                }}
            >
                <InfoIcon
                    style={{ color: barHeight > 10 ? "white" : "#6E8AA6" }}
                />
            </button>
            <div className="verticalVote__bar__title">{shortVersion}</div>
        </div>
    );
};
