import { Statement } from "delib-npm";
import React from "react";
import { setSelectionsToOptions, sortOptionsIndex } from "../statementVoteCont";
import { useParams } from "react-router-dom";
import { isOptionFn } from "../../../../../../controllers/general/helpers";
import { VerticalOptionBar } from "./VerticalOptionBar";
import HorizontalOptionBar from "./HorizontalOptionBar";
import useWindowDimensions from "../../../../../../controllers/hooks/useWindowDimentions";

interface Props {
    setStatementInfo: React.Dispatch<React.SetStateAction<Statement | null>>;
    subStatements: Statement[];
    statement: Statement;
    setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
    totalVotes: number;
}

export default function VotingArea({
    setStatementInfo,
    subStatements,
    statement,
    setShowInfo,
    totalVotes,
}: Props) {
    const { sort } = useParams();
    const { width } = useWindowDimensions();

    const getOptions = subStatements.filter((subStatement: Statement) =>
        isOptionFn(subStatement),
    );

    const optionsCount = getOptions.length;

    const _options = setSelectionsToOptions(statement, getOptions);
    const options = sortOptionsIndex(_options, sort);

    return isVerticalOptionBar(width, optionsCount) ? (
        <div className="verticalVote">
            {options.map((option: Statement, i: number) => {
                return (
                    <VerticalOptionBar
                        key={option.statementId}
                        order={i}
                        option={option}
                        totalVotes={totalVotes}
                        statement={statement}
                        setShowInfo={setShowInfo}
                        setStatementInfo={setStatementInfo}
                        optionsCount={optionsCount}
                    />
                );
            })}
        </div>
    ) : (
        <div className="horizontalVote">
            {options.map((option: Statement, i: number) => {
                return (
                    <HorizontalOptionBar
                        key={option.statementId}
                        order={i}
                        option={option}
                        totalVotes={totalVotes}
                        statement={statement}
                        setShowInfo={setShowInfo}
                        setStatementInfo={setStatementInfo}
                        optionsCount={optionsCount}
                    />
                );
            })}
        </div>
    );
}

function isVerticalOptionBar(width: number, optionsCount: number) {
    if (width < 350 && optionsCount >= 4) {
        return false;
    }

    if (width < 90 * optionsCount) {
        return false;
    }

    return true;
}
