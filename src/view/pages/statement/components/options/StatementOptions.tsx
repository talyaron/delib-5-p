import { FC, useEffect, useState } from 'react';
import { Statement } from 'delib-npm';
import StatementOptionsNav from './StatementOptionsNav';
import { useParams } from 'react-router';
import { Screen } from '../../../../../model/system';
import StatementOptionCard from './StatementOptionCard';
import { useAppDispatch } from '../../../../../functions/hooks/reduxHooks';
import { setStatementOrder } from '../../../../../model/statements/statementsSlice';
import Modal from '../../../../components/modal/Modal';
import NewSetStatementSimple from '../set/NewStatementSimple';
// import Fav from '../../components/fav/Fav';


interface Props {
    statement: Statement;
    subStatements: Statement[];
    handleShowTalker: Function;
    showNav?: boolean;
}

const StatementOptions: FC<Props> = ({ statement, subStatements, handleShowTalker, showNav }) => {
    try {
        const [showModal, setShowModal] = useState(false);
        if (showNav === undefined) showNav = true;
        const dispatch = useAppDispatch();
        const { sort } = useParams();
        const __substatements = subStatements.filter((subStatement: Statement) => subStatement.isOption);
        const _subStatements = sortSubStatements(__substatements, sort);

        function dispatchCB(statement: Statement, order: number) {
            dispatch(setStatementOrder({ statementId: statement.statementId, order: order }))
        }

        useEffect(() => {
            _subStatements.forEach((statement: Statement, i: number) => {
                dispatchCB(statement, i);
            })
        }, [sort])

        let topSum = 50;
        let tops: number[] = [topSum];
    
        return (
            <div className="page__main options">
                <div className="wrapper options__wrapper">

                    {_subStatements?.map((statementSub: Statement, i: number) => {

                        //get the top of the element
                        if (statementSub.elementHight) {
                            topSum += ((statementSub.elementHight) + 10);
                            tops.push(topSum)

                        }

                        return <StatementOptionCard key={statementSub.statementId} statement={statementSub} showImage={handleShowTalker} top={tops[i]} />
                    })}

                </div>
                {/* <Fav onclick={handleAddStatment} /> */}
                {showNav ? <StatementOptionsNav statement={statement} /> : null}
                {showModal ? <Modal>
                    <NewSetStatementSimple parentStatement={statement} isOption={true} setShowModal={setShowModal} />
                </Modal> : null}
                <div className="fav fav--fixed" onClick={() => setShowModal(true)}>
                    <div>+</div>
                </div>
            </div>
        )
    } catch (error) {
        console.error(error);
        return null;
    }



}

export default StatementOptions;

function sortSubStatements(subStatements: Statement[], sort: string | undefined) {
    try {
        let _subStatements = [...subStatements];
        switch (sort) {
            case Screen.OPTIONS_CONSENSUS:
                _subStatements = subStatements.sort((a: Statement, b: Statement) => b.consensus - a.consensus);
                break;
            case Screen.OPTIONS_NEW:
                _subStatements = subStatements.sort((a: Statement, b: Statement) => b.createdAt - a.createdAt);
                break;
            case Screen.OPTIONS_RANDOM:
                _subStatements = subStatements.sort(() => Math.random() - 0.5);
                break;
            case Screen.OPTIONS_UPDATED:
                _subStatements = subStatements.sort((a: Statement, b: Statement) => b.lastUpdate - a.lastUpdate);
                break;
            default:
                return _subStatements;
        }
        // _subStatements.forEach((statement: Statement, i: number) => {
        //     dispatchCB(statement, i);
        // })

        return _subStatements;
    } catch (error) {
        console.error(error);
        return subStatements
    }
}

