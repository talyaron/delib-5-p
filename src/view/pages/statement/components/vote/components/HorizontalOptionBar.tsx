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
import InfoIcon from "../../../../../components/icons/InfoIcon";
import VoteIcon from "../../../../../components/icons/VoteIcon";

export interface OptionBarProps {
    option: Statement;
    totalVotes: number;
    statement: Statement;
    order: number;
    setStatementInfo: React.Dispatch<React.SetStateAction<Statement | null>>;
    setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
    optionsCount: number;
}
export const HorizontalOptionBar: FC<OptionBarProps> = ({
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

    // const barWidth =
    //     width / optionsCount - 20 > 120
    //         ? 120
    //         : width / optionsCount - 10 < 60
    //           ? 70
    //           : width / optionsCount - 20;

    const barWidth = 80;

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
            className="horizontalVote__bar"
            style={{
                left: `${(_optionOrder - order) * barWidth}px`,
                width: `${barWidth}px`,
            }}
        >
            <div
                className="horizontalVote__bar__column"
                style={{
                    width: `${barWidth}px`,
                    filter: "drop-shadow(0px 2px 4px rgba(151, 173, 184, 0.525))",
                }}
            >
                {barHeight > 0 && (
                    <div className="horizontalVote__bar__column__stat">
                        <span>{barHeight}%</span>

                        <span>{selections}</span>
                    </div>
                )}
                <div
                    className="horizontalVote__bar__column__bar"
                    style={{
                        height: `${barHeight}%`,
                        width: `${barWidth - padding}px`,
                        backgroundColor: option.color,
                    }}
                ></div>
            </div>
            <div className="btnShadow">
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
                            ? "horizontalVote__bar__btn horizontalVote__bar__btn--selected"
                            : "horizontalVote__bar__btn"
                    }
                    onClick={handlePressButton}
                >
                    <VoteIcon
                        color={
                            vote?.statementId !== option.statementId
                                ? option.color
                                : "white"
                        }
                    />
                </div>
            </div>
            <div
                className="infoIcon"
                onClick={() => {
                    setStatementInfo(option), setShowInfo(true);
                }}
            >
                <InfoIcon color={barHeight > 10 ? "white" : "#6E8AA6"} />
            </div>
            <div className="horizontalVote__bar__title">{shortVersion}</div>
        </div>
    );
};

export default HorizontalOptionBar;
