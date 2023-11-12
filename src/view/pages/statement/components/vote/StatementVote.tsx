import { FC, useEffect, useState } from 'react';
import {Statement} from 'delib-npm';


import StatementOptionsNav from '../options/StatementOptionsNav';

import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../functions/hooks/reduxHooks';
import { getToVoteOnParent } from '../../../../../functions/db/vote/getVotes';
import { parentVoteSelector, setVoteToStore } from '../../../../../model/vote/votesSlice';
import { setVote } from '../../../../../functions/db/vote/setVote';
import { Screen } from '../../../../../model/system';
import NewSetStatementSimple from '../set/NewStatementSimple';
import Modal from '../../../../components/modal/Modal';
import AddIcon from '@mui/icons-material/Add';


interface Props {
    statement: Statement;
    subStatements: Statement[];
}
let getVoteFromDB = false;
const barWidth = 120;
const padding = 10;

const StatementVote: FC<Props> = ({ statement, subStatements }) => {
    const dispatch = useAppDispatch();
    const { sort } = useParams();

    const [showModal, setShowModal] = useState(false);
   
    const __options = subStatements.filter((subStatement: Statement) => subStatement.isOption);
    const _options = setSelectionsToOptions(statement, __options);
    const options = sortOptionsIndex(_options, sort);
    const totalVotes = getTotalVoters(statement);

    useEffect(() => {
        if (!getVoteFromDB) {
            getToVoteOnParent(statement.statementId, updateStoreWitehVoteCB);
            getVoteFromDB = true;
        }

    }, []);

    // useEffect(() => {
    //     setOptions(_options);
    // }, [_options]);

    function updateStoreWitehVoteCB(option: Statement) {
        dispatch(setVoteToStore(option));
    }

    return (
        <div className='statement__main'>
            <h2>Votes</h2>
            <p>הצביעו: {totalVotes}</p>
            <div className='statement__vote'>
                {options.map((option: Statement, i: number) => {
                    return <OptionBar key={option.statementId} order={i} option={option} totalVotes={totalVotes} statement={statement} />
                })}
            </div>
            <StatementOptionsNav statement={statement} />
            {showModal ? <Modal>
                    <NewSetStatementSimple parentStatement={statement} isOption={true} setShowModal={setShowModal} />
                </Modal> : null}
            <div className="fav fav--fixed fav--up" onClick={() => setShowModal(true)}>
            <div ><AddIcon style={{transform:`translate(0px,-40%) scale(1.45)`}}/></div>
            </div>
        </div>
    )
}

export default StatementVote

interface OptionBarProps {
    option: Statement;
    totalVotes: number;
    statement: Statement;
    order: number;
}

const OptionBar: FC<OptionBarProps> = ({ option, totalVotes, statement, order }) => {
    const dispatch = useAppDispatch();
    const vote = useAppSelector(parentVoteSelector(option.parentId));
    const _optionOrder = option.order || 0;

    const handlePressButton = () => {
        setVote(option, setVoteCB);
    }
    function setVoteCB(option: Statement) {
        dispatch(setVoteToStore(option));
    }
    const selections: number = getSelections(statement, option);

    return (
        <div className='statement__vote__bar' style={{ right: `${(_optionOrder - order) * barWidth}px`, width:`${barWidth}px` }}>
            <div className='statement__vote__bar__column' style={{ width: `${barWidth}px` }}>
                <div className='statement__vote__bar__column__bar' style={{ height: `${((selections) / totalVotes) * 100}%`,width: `${barWidth-padding}px` }}>
                    {selections}
                </div>
            </div>
            <div
            style={{ width: `${barWidth-padding}px` }}
                className={vote?.statementId === option.statementId ? "statement__vote__bar__btn statement__vote__bar__btn--selected" : "statement__vote__bar__btn"}
                onClick={handlePressButton}>
                {option.statement}
            </div>
        </div>

    )

}

function getTotalVoters(statement: Statement) {
    try {
        const { selections } = statement;

        if (selections) {
            let totalVoters = 0;
            Object.keys(statement.selections).forEach((key: string) => {
                if (key !== "none") {
                    totalVoters += statement.selections[key];
                }
            })

            return totalVoters;
        }
        return 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

function sortOptionsIndex(options: Statement[], sort: string | undefined) {
    let _options = JSON.parse(JSON.stringify(options));

    // sort only the order of the options acording to the sort
    switch (sort) {
        case Screen.VOTES_NEW:
            _options = _options.sort((a: Statement, b: Statement) => {
                return b.createdAt - a.createdAt;
            })
            break;

        case Screen.VOTES_CONSENSUS:
            _options = _options.sort((a: Statement, b: Statement) => {
                return b.consensus - a.consensus;
            })
            break;
        case Screen.VOTES_RANDOM:
            _options = _options.sort(() => Math.random() - 0.5);
            break;
        case Screen.VOTESֹֹֹ_VOTED:
            _options = _options.sort((a: Statement, b: Statement) => {
                const aVoted: number = a.voted === undefined ? 0 : a.voted;
                const bVoted: number = b.voted === undefined ? 0 : b.voted;
                return bVoted - aVoted;
            })
            break;
        case Screen.VOTES_UPDATED:
            _options = _options.sort((a: Statement, b: Statement) => {
                return b.lastUpdate - a.lastUpdate;
            })
            break;
        default:
            break;
    }
    _options = _options.map((option: Statement, i: number) => {
        option.order = i;
        return option;
    })
    _options = _options.sort((a: Statement, b: Statement) => {
        return b.createdAt - a.createdAt;
    });

    return _options;



}

function getSelections(statement: Statement, option: Statement) {
    try {
        if (statement.selections && statement.selections.hasOwnProperty(`${option.statementId}`)) {
            const optionSelections = statement.selections[option.statementId];
            if (!optionSelections) return 0;
            return optionSelections;
        }
        return 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

function setSelectionsToOptions(statement: Statement, options: Statement[]) {
    try {
        const _options = JSON.parse(JSON.stringify(options));
        if (statement.selections) {
            _options.forEach((option: Statement) => {
                if (statement.selections.hasOwnProperty(`${option.statementId}`)) {
                    const optionSelections = statement.selections[option.statementId];
                    option.voted = optionSelections;
                }
            })
        }

        return _options;
    } catch (error) {
        console.error(error);
        return options;
    }
}
