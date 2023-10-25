
//components

//icons
import { Link, useParams } from 'react-router-dom';
import { SetStatementComp } from './SetStatementComp';
import ArrowBackIosIcon from '../../../../icons/ArrowBackIosIcon';

export const SetStatement = () => {
    const { statementId } = useParams();
    return (
        <div className='page setStatement'>
            <div className="page__header setStatement__header">
                <span></span>
                <h1>{statementId ? "עדכון" : "הוספת קבוצה חדשה"}</h1>
                <Link to={"/home"} className='setStatement__back'> <ArrowBackIosIcon /></Link>
            </div>
            <div className="page__main">
                <div className="wrapper">
                    <SetStatementComp />
                </div>
            </div>
        </div>

    )
}

export default SetStatement