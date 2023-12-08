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

const Main = () => {
    // Hooks
    const navigate = useNavigate();

    const statements = [...useAppSelector(statementsSubscriptionsSelector)]
        .filter((state) => state.statement.statementType === "question")
        .sort((a, b) => b.lastUpdate - a.lastUpdate);

    function handleAddStatment() {
        navigate("/home/addStatment", {
            state: { from: window.location.pathname },
        });
    }

    return (
        <ScreenSlide className="page__main" slideFromRight={true}>
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
        </ScreenSlide>
    );
};

export default Main;
