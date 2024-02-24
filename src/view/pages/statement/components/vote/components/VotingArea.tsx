import { Statement } from "delib-npm";
import React from "react";
import { setSelectionsToOptions, sortOptionsIndex } from "../statementVoteCont";
import { useParams } from "react-router-dom";
import { isOptionFn } from "../../../../../../functions/general/helpers";
import { VerticalOptionBar } from "./VerticalOptionBar";

interface Props {
    setStatementInfo: React.Dispatch<React.SetStateAction<Statement | null>>;
    subStatements: Statement[];
    statement: Statement;
    setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
    totalVotes: number;
}

export default function VotingArea({ setStatementInfo, subStatements, statement, setShowInfo, totalVotes }: Props) {
    const { sort } = useParams();

    const getOptions = subStatements.filter((subStatement: Statement) =>
        isOptionFn(subStatement),
    );
    
    const _options = setSelectionsToOptions(statement, getOptions);
    const options = sortOptionsIndex(_options, sort);

    return (
        <div className="vote">
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
                    />
                );
            })}
        </div>
    );
}
