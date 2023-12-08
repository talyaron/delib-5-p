// Third party libraries
import { useNavigate } from "react-router-dom";
import { statementsSubscriptionsSelector } from "../../../model/statements/statementsSlice";
import { useAppSelector } from "../../../functions/hooks/reduxHooks";
import { t } from "i18next";

// Custom components
import Fav from "../../components/fav/Fav";

import ScreenSlide from "../../components/animation/ScreenSlide";

// Other
import MainCardRes from "./MainCard2";
import { FilterType } from "../../../functions/general/sorting";

const Main = () => {
    // Hooks
    const navigate = useNavigate();

    const statements = [
        ...useAppSelector(statementsSubscriptionsSelector),
    ].sort((a, b) => b.lastUpdate - a.lastUpdate);

    function handleAddStatment() {
        navigate("/home/addStatment", {
            state: { from: window.location.pathname },
        });
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

export default Main;
