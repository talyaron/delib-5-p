import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Fav from "../../components/fav/Fav"

import { listenStatmentsSubsciptions } from "../../../functions/db/statements/getStatement"
import { Results, StatementSubscription } from "delib-npm"
import {
    useAppDispatch,
    useAppSelector,
} from "../../../functions/hooks/reduxHooks"
import {
    deleteSubscribedStatement,
    setStatementSubscription,
    statementsSubscriptionsSelector,
} from "../../../model/statements/statementsSlice"
import useAuth from "../../../functions/hooks/authHooks"
import { setUser } from "../../../model/users/userSlice"
import { logOut } from "../../../functions/db/auth"

import { install } from "../../../main"
import { sortStatementsByHirarrchy } from "./mainControlles"
import MainCard from "./mainCard/MainCard"

//install

let unsubscribe: Function = () => {}

const Main = () => {
    const navigate = useNavigate()
    const statements = [
        ...useAppSelector(statementsSubscriptionsSelector),
    ].sort((a, b) => b.lastUpdate - a.lastUpdate)
    const isLgged = useAuth()
    const dispatch = useAppDispatch()

    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

    function updateStoreStSubCB(statementSubscription: StatementSubscription) {
        dispatch(setStatementSubscription(statementSubscription))
    }
    function deleteStoreStSubCB(statementId: string) {
        dispatch(deleteSubscribedStatement(statementId))
    }

    useEffect(() => {
        setDeferredPrompt(install.deferredPrompt)
    }, [])

    useEffect(() => {
        if (isLgged) {
            unsubscribe = listenStatmentsSubsciptions(
                updateStoreStSubCB,
                deleteStoreStSubCB
            )
        }
        return () => {
            unsubscribe()
        }
    }, [isLgged])

    function handleInstallApp() {
        try {
            const deferredPrompt = install.deferredPrompt

            if (deferredPrompt) {
                deferredPrompt.prompt()
                deferredPrompt.userChoice.then((choiceResult: any) => {
                    if (choiceResult.outcome === "accepted") {
                        console.info("User accepted the A2HS prompt")
                    }
                    setDeferredPrompt(null)
                })
            }
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

    const _statements = [...statements.map((statement) => statement.statement)]
    const _results = sortStatementsByHirarrchy(_statements)

    return (
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
    )
}

export default React.memo(Main)
