import React, { useEffect, useState } from "react";

// Third party libraries
import { useNavigate } from "react-router-dom";
import { Results, StatementType } from "delib-npm";
import { t } from "i18next";

// Custom components
import Fav from "../../components/fav/Fav";
import MainCard from "./mainCard/MainCard";
import ScreenSlide from "../../components/animation/ScreenSlide";

// Firestore functions
import { logOut } from "../../../functions/db/auth";
import { FilterType, filterByStatementType, prompStore } from "./mainCont";

// Redux store
import { useAppDispatch } from "../../../functions/hooks/reduxHooks";
import { setUser } from "../../../model/users/userSlice";

// Other
import { install } from "../../../main";
import useSortStatements from "../../../functions/hooks/useSortStatements";

const Main = () => {
    // Hooks
    const navigate = useNavigate();
    const results = useSortStatements();
    const dispatch = useAppDispatch();

    // Use State
    const [filterState, setFilter] = useState<FilterType>(FilterType.all);
    //for deffered app install
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        //for defferd app install
        setDeferredPrompt(install.deferredPrompt);
    }, []);

    function handleInstallApp() {
        try {
            prompStore(setDeferredPrompt);
        } catch (error) {
            console.error(error);
        }
    }

    function handleAddStatment() {
        navigate("/home/addStatment", {
            state: { from: window.location.pathname },
        });
    }

    function handleLogout() {
        logOut();
        dispatch(setUser(null));
    }
    const resultsType = filterByStatementType(filterState)
        .types as StatementType[];

    return (
        <ScreenSlide className="page" toSubStatement={true}>
            <div className="page__header">
                <div className="page__header__title">
                    <h1>{t("Delib 5")}</h1>
                    <b>-</b>
                    <h2>{t("Creating Agreements")}</h2>
                </div>
                <div className="btns">
                    <button onClick={handleLogout}>{t("Disconnect")}</button>
                    {deferredPrompt && (
                        <button onClick={handleInstallApp}>
                            {t("Install the App")}
                        </button>
                    )}
                    <button
                        onClick={() =>
                            navigate("/map", {
                                state: { from: window.location.pathname },
                            })
                        }
                    >
                        Map
                    </button>
                </div>
            </div>
            <div className="page__main">
                <div className="wrapper">
                    <h2>{t("Conversations")}</h2>
                    <label>{t("Show")}</label>
                    <select onChange={(ev: any) => setFilter(ev.target.value)}>
                        <option value={FilterType.all}>{t("All")}</option>
                        <option value={FilterType.questions}>
                            {t("Questions")}
                        </option>
                        <option value={FilterType.questionsResults}>
                            {t("Questions and Results")}
                        </option>
                        <option value={FilterType.questionsResultsOptions}>
                            {t("Questions, options and Results")}
                        </option>
                    </select>
                    {results.map((result: Results) => (
                        <MainCard
                            key={result.top.statementId}
                            results={result}
                            resultsType={resultsType}
                        />
                    ))}
                </div>
                <Fav isHome={true} onclick={handleAddStatment} />
            </div>
        </ScreenSlide>
    );
};

export default React.memo(Main);
