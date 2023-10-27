import { FC, useEffect, useState } from 'react';
import { StatementType } from '../../../../../model/statements/statementModel';
import { setStatmentToDB } from '../../../../../functions/db/statements/setStatments';
import { useNavigate, useParams } from 'react-router-dom';

import { UserSchema, User } from 'delib-npm';
import Loader from '../../../../components/loaders/Loader';
import { useAppDispatch, useAppSelector } from '../../../../../functions/hooks/reduxHooks';
import { setStatement, statementSelector } from '../../../../../model/statements/statementsSlice';
import { getStatementFromDB } from '../../../../../functions/db/statements/getStatement';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { navArray } from '../nav/StatementNav';
import { NavObject, Screen, Statement } from 'delib-npm';
import { userSelector } from '../../../../../model/users/userSlice';
import { store } from '../../../../../model/store';

interface Props {
    simple?: boolean
    new?: boolean
}


export const SetStatementComp: FC<Props> = ({ simple }) => {
    
    const navigate = useNavigate();
    const { statementId } = useParams();
    const statement = useAppSelector(statementSelector(statementId));
    const user:User|null = useAppSelector(userSelector);
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (statementId) {
            if (!statement)
                (async () => {
                    const statementDB = await getStatementFromDB(statementId);
                    if (statementDB) dispatch(setStatement(statementDB));
                })();

        }
    }, [statementId]);

    async function handleSetStatment(ev: React.FormEvent<HTMLFormElement>) {
        try {

            ev.preventDefault();
            setIsLoading(true);
            const data = new FormData(ev.currentTarget);
          
            let title: any = data.get('statement');
            const description = data.get('description');
            //add to title * at the beggining
            if (title && !title.startsWith('*')) title = `*${title}`;
            const _statement = `${title}\n${description}`;
           
            
            UserSchema.parse(user);


            const newStatement: any = Object.fromEntries(data.entries());
         

            newStatement.subScreens = parseScreensCheckBoxes(newStatement, navArray);
            newStatement.statement = _statement;
            newStatement.statementId = statement?.statementId || crypto.randomUUID();
            newStatement.creatorId = statement?.creator.uid || store.getState().user.user?.uid;
            newStatement.parentId = statement?.parentId || statementId || "top";
            newStatement.type = statementId === undefined ? StatementType.GROUP : StatementType.STATEMENT;
            newStatement.creator = statement?.creator || user;
            if (statement) {
                newStatement.lastUpdate = new Date().getTime();
            }
            newStatement.createdAt = statement?.createdAt || new Date().getTime();

            newStatement.consensus = statement?.consensus || 0;

            const setSubsciption: boolean = statementId === undefined ? true : false;

            const _statementId = await setStatmentToDB(newStatement, setSubsciption);

            setIsLoading(false);

            if (_statementId)
                navigate(`/home/statement/${_statementId}`);

            else
                throw new Error("statement not found");
        } catch (error) {
            console.error(error);
        }
    }

    const arrayOfStatementParagrphs = statement?.statement.split('\n') || [];
    //get all elements of the array except the first one
    const description = arrayOfStatementParagrphs?.slice(1).join('\n');


    return (
        <div className='wrapper'>

            {!isLoading ? <form onSubmit={handleSetStatment} className='setStatement__form'>
                <label htmlFor="statement">כותרת</label>
                <input type="text" name="statement" placeholder='כותרת הקבוצה' defaultValue={arrayOfStatementParagrphs[0]} />
                <textarea name="description" placeholder='תיאור הקבוצה' defaultValue={description}></textarea>
                {!simple ? <section>

                    <label htmlFor="subPages">תת עמודים</label>
                    <FormGroup>
                        {navArray
                            .filter(navObj => navObj.link !== Screen.SETTINGS)
                            .map((navObj) =>
                                <FormControlLabel key={navObj.id} control={<Checkbox name={navObj.link} defaultChecked={isSubPageChecked(statement, navObj)} />} label={navObj.name} />
                            )}

                    </FormGroup>
                </section> : null}

                <div className="btnBox">
                    <button type="submit">{!statementId ? "הוספה" : "עדכון"}</button>
                </div>

            </form> :
                <div className="center">
                    <h2>מעדכן...</h2>
                    <Loader />
                </div>}
        </div>

    );
};

function isSubPageChecked(statement: Statement | undefined, navObj: NavObject) {
    try {
        //in case of a new statement
        if (!statement){
            if(navObj.default === false) return false;
            else return true;
        }
        //in case of an existing statement
        const subScreens = statement.subScreens as Screen[];
        if (subScreens === undefined) return true;
        if (subScreens?.includes(navObj.link)) return true;
        
    } catch (error) {
        console.error(error);
        return true;
    }
}

function parseScreensCheckBoxes(dataObj: Object, navArray: NavObject[]) {
    try {
        if (!dataObj) throw new Error("dataObj is undefined");
        if (!navArray) throw new Error("navArray is undefined");
        const _navArray = [...navArray];

        const screens = _navArray
            //@ts-ignore
            .filter(navObj => dataObj[navObj.link] === "on")
            .map(navObj => navObj.link);
        return screens;
    } catch (error) {
        console.error(error);
        return [];
    }
}
