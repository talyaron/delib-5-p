import React, { useState } from "react";

// Third party libraries
import { useNavigate } from "react-router-dom";

import { t } from "i18next";

// Custom components
import Fav from "../../components/fav/Fav";

import ScreenSlide from "../../components/animation/ScreenSlide";

// Firestore functions
import { logOut } from "../../../functions/db/auth";


// Redux store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../functions/hooks/reduxHooks";
import { statementsSubscriptionsSelector } from "../../../model/statements/statementsSlice";
import { setUser } from "../../../model/users/userSlice";

// Other
import { install } from "../../../main";
import { prompStore } from "./mainCont";
import MainCardRes from "./MainCard2";

const Main = () => {
    // Hooks
    const navigate = useNavigate();
    const results = useSortStatements();


    function handleAddStatment() {
        navigate("/home/addStatment", {
            state: { from: window.location.pathname },
        });
    }

    function handleLogout() {
        logOut();
        dispatch(setUser(null));
    }


    return (
        <ScreenSlide className="page__main" slideFromRight={true}>
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
            <div className="page__main">
                <div className="wrapper">
                    <h2>{t("Conversations")}</h2>
                    
                    {statements.map((statement) => (
                        <MainCardRes
                            key={statement.statement.statementId}
                            statement={statement.statement}
                        />
                    ))}
                </div>
                <Fav isHome={true} onclick={handleAddStatment} />
            </div>
        </ScreenSlide>
    );
};

export default React.memo(Main);
