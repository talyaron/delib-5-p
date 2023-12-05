import React from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import ScreenSlide from "../../components/animation/ScreenSlide";
import { logOut } from "../../../functions/db/auth";
import { t } from "i18next";
import { useAppSelector } from "../../../functions/hooks/reduxHooks";
import { statementsSelector } from "../../../model/statements/statementsSlice";

export default function Map() {
    const navigate = useNavigate();
    const { statementId } = useParams();

    const statements = [...useAppSelector(statementsSelector)].sort(
        (a, b) => b.lastUpdate - a.lastUpdate
    );

    return statementId ? (
        <Outlet />
    ) : (
        <ScreenSlide className="page" toSubStatement={true}>
            <div className="page__header">
                <div className="page__header__title">
                    <h1>{t("Delib 5")}</h1>
                    <b>-</b>
                    <h2>{t("Creating Agreements")}</h2>
                </div>
                <div className="btns">
                    <button onClick={() => logOut()}>{t("Disconnect")}</button>
                    <button onClick={() => navigate("/home")}>
                        {t("Home")}
                    </button>
                </div>
            </div>
            <div className="page__main">
                <div className="wrapper">
                        {statements.map((statement, index) => (
                            <button
                                key={index}
                                onClick={() =>
                                    navigate(`/map/${statement.statementId}`)
                                }
                            >
                                {statement.statement}
                            </button>
                        ))}
                </div>
            </div>
        </ScreenSlide>
    );
}
