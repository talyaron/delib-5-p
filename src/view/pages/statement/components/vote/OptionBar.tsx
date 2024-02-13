import { FC } from "react";

// Third party imports
import { Statement } from "delib-npm";

// Redux store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../../functions/hooks/reduxHooks";
import {
    parentVoteSelector,
    setVoteToStore,
} from "../../../../../model/vote/votesSlice";

// Statements helpers
import { setVote } from "../../../../../functions/db/vote/setVote";
import { getSelections } from "./getSelections";
import useWindowDimensions from "../../../../../functions/hooks/useWindowDimentions";
import { statementTitleToDisplay } from "../../../../../functions/general/helpers";
import InfoIcon from "../../../../components/icons/InfoIcon";
import HandsIcon from "../../../../components/icons/HandsIcon";
import VoteIcon from "../../../../components/icons/VoteIcon";

export interface OptionBarProps {
    option: Statement;
    totalVotes: number;
    statement: Statement;
    order: number;
    setStatementInfo: React.Dispatch<React.SetStateAction<Statement | null>>;
    setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}
export const OptionBar: FC<OptionBarProps> = ({
    option,
    totalVotes,
    statement,
    order,
    setStatementInfo,
    setShowInfo,
}) => {
    const dispatch = useAppDispatch();
    const vote = useAppSelector(parentVoteSelector(option.parentId));
    const direction = document.body.style.direction as "ltr" | "rtl";

    const _optionOrder = option.order || 0;

    const handlePressButton = () => {
        dispatch(setVoteToStore(option));
        setVote(option);
    };

    const selections: number = getSelections(statement, option);
    const { width } = useWindowDimensions();

    const barWidth = width / 4 > 120 ? 120 : width / 4;
    const padding = 40;

    const { shortVersion } = statementTitleToDisplay(option.statement, 30);
    const barHeight = Math.round((selections / totalVotes) * 100);

    return (
            
            <div className="vote__bar"
                style={{
                   right: `${(_optionOrder - order) * barWidth}px`,
                   width: `${barWidth}px`,
                }}
             >
            
            <div 
                className="vote__bar__column"
                style={{ width: `${barWidth}px` }}
            >
                {barHeight > 0 && (
                    <div className="vote__bar__column__stat">
                        <span>{barHeight}%</span>

                        <span>{selections}</span>
                    </div>
                )}
                <div className="vote__bar__column__barShadow">
                    
                   <div
                    className="vote__bar__column__barShadow__bar"
                    style={{
                        height: `${barHeight}%`,
                        width: `${barWidth - padding}px`,
                        backgroundColor: option.color,
                    }}
                    ></div>
                 {/* <div
                    className="vote__bar__column__bar"
                    style={{
                        height: `${barHeight}%`,
                        width: `${barWidth - padding}px`,
                        backgroundColor: option.color,
                    }}
                ></div> */}
                </div>
            </div>
           
            
            
            <div className="btnShadow">
                <div
                    style={{
                        width: `${barWidth - padding}px`,
                        direction: direction,
                        backgroundColor:
                            vote?.statementId === option.statementId
                                ? option.color
                                : "white",
                    }}
                    className={
                        vote?.statementId === option.statementId
                            ? "vote__bar__btn vote__bar__btn--selected"
                            : "vote__bar__btn"
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
            <div className="vote__bar__title">{shortVersion}</div>
          
        </div>
    );
};
