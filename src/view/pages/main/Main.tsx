import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Results } from 'delib-npm';
import { useAppDispatch, useAppSelector } from '../../../functions/hooks/reduxHooks';
import { statementsSubscriptionsSelector } from '../../../model/statements/statementsSlice';
import { setUser } from '../../../model/users/userSlice';
import { install } from '../../../main';


// Custom components
import Fav from "../../components/fav/Fav"
import MainCard from "./mainCard/MainCard"

// Firestore functions
import { logOut } from "../../../functions/db/auth"
import { prompStore, sortStatementsByHirarrchy } from './mainCont';
import ScreenSlide from '../../components/animation/ScreenSlide';


const Main = () => {
    const navigate = useNavigate();
    const statements = [...useAppSelector(statementsSubscriptionsSelector)].sort((a, b) => b.lastUpdate - a.lastUpdate);
   
    const dispatch = useAppDispatch();

    //for defferd app install
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);


    useEffect(() => {
        //for defferd app install
        setDeferredPrompt(install.deferredPrompt);
    
    }, [])
    



    function handleInstallApp() {
        try {
            prompStore(setDeferredPrompt);
        } catch (error) {
            console.error(error)
        }
    }

    function handleAddStatment() {
        navigate("/home/addStatment")
    }

    function handleLogout() {
        logOut()
        dispatch(setUser(null))
    }

    const _statements = [...statements.map((statement) => statement.statement)];
    const _results = sortStatementsByHirarrchy(_statements);



    return (
        <ScreenSlide>
            <div className="page">
                <div className="page__header">
                    <div className="page__header__title">
                        <h1>דליב</h1>
                        <b>-</b>
                        <h2> יוצרים הסכמות</h2>
                    </div>
                    <div className="btns">
                        <button onClick={handleLogout}>התנתקות</button>
                        {deferredPrompt && (
                            <button onClick={handleInstallApp}>
                                התקנת האפליקציה
                            </button>
                        )}
                    </div>
                </div>
                <div className="page__main">
                    <div className="wrapper">
                        <h2>שיחות</h2>
                        {_results.map((result: Results) => (
                            <MainCard
                                key={result.top.statementId}
                                results={result}
                            />
                        ))}
                    </div>
                </div>
                <Fav onclick={handleAddStatment} />
            </div>
        </ScreenSlide>
    )
}

export default React.memo(Main)


