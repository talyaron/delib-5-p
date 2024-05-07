import React, { FC } from "react";
import { Statement, StatementType, isOptionFn } from "delib-npm";
import {
    setSelectionsToOptions,
    sortOptionsIndex,
} from "../../statementVoteCont";
import { useParams } from "react-router-dom";
import OptionBar from "../optionBar/OptionBar";
import "./VotingArea.scss";
import useWindowDimensions from "../../../../../../../controllers/hooks/useWindowDimentions";

interface VotingAreaProps {
    setStatementInfo: React.Dispatch<React.SetStateAction<Statement | null>>;
    subStatements: Statement[];
    statement: Statement;
    setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
    totalVotes: number;
}

const VotingArea: FC<VotingAreaProps> = ({
    setStatementInfo,
    subStatements,
    statement,
    setShowInfo,
    totalVotes,
}) => {
    const { sort } = useParams();

    //if statementSettings.inVotingGetOnlyResults is true, only show results or selections
    const _options = statement.statementSettings?.inVotingGetOnlyResults
        ? subStatements.filter(
              (st) =>
                  st.statementType === StatementType.result ||
                  st.statementType === StatementType.selection,
          )
        : subStatements;
   
    const options = getSortedVotingOptions({
        statement,
        subStatements: _options,
        sort,
    });
    const optionsCount = options.length;

    const { width } = useWindowDimensions();
    const shouldShowVerticalBar = isVerticalOptionBar(width, optionsCount);

    return (
        <div
            className={`voting-area ${shouldShowVerticalBar ? "vertical" : "horizontal"}`}
        >
            {options.map((option, i) => {
                return (
                    <OptionBar
                        isVertical={shouldShowVerticalBar}
                        key={option.statementId}
                        order={i}
                        option={option}
                        totalVotes={totalVotes}
                        statement={statement}
                        setShowInfo={setShowInfo}
                        setStatementInfo={setStatementInfo}
                        optionsCount={optionsCount}
                        screenWidth={width}
                    />
                );
            })}
        </div>
    );
};

export default VotingArea;

function isVerticalOptionBar(width: number, optionsCount: number) {
    if (width < 350 && optionsCount >= 4) {
        return false;
    }

    if (width < 90 * optionsCount) {
        return false;
    }

    return true;
}

interface GetVotingOptionsParams {
    statement: Statement;
    subStatements: Statement[];
    sort: string | undefined;
}

const getSortedVotingOptions = ({
    statement,
    subStatements,
    sort,
}: GetVotingOptionsParams): Statement[] => {
    const options = subStatements.filter((subStatement: Statement) =>
        isOptionFn(subStatement),
    );
    const optionsWithSelections = setSelectionsToOptions(statement, options);

    return sortOptionsIndex(optionsWithSelections, sort);
};
