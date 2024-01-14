// Third party libraries
import { useLocation, useNavigate } from "react-router-dom";
import { statementsSubscriptionsSelector } from "../../../model/statements/statementsSlice";
import { useAppSelector } from "../../../functions/hooks/reduxHooks";

// Custom components
import Fav from "../../components/fav/Fav";
import ScreenFadeIn from "../../components/animation/ScreenFadeIn";

// Other
// import MainCardRes from "./MainCard2";
import MainCard from "./MainCard2";
import ScreenSlide from "../../components/animation/ScreenSlide";
import { t } from "i18next";

const Main = () => {
    // Hooks
    const navigate = useNavigate();
    const location = useLocation();

    const backFromAddStatment = location.state?.from === "/home/addStatment";

    const statements = [...useAppSelector(statementsSubscriptionsSelector)]
        .filter((state) => state.statement.parentId === "top")
        .sort((a, b) => b.lastUpdate - a.lastUpdate);

    function handleAddStatment() {
        navigate("/home/addStatment", {
            state: { from: window.location.pathname },
        });
    }

    return backFromAddStatment ? (
        <ScreenSlide className="page__main slide-in">
            <div className="wrapper">
                {statements.map((statement) => (
                    <MainCard
                        key={statement.statement.statementId}
                        statement={statement.statement}
                    />
                ))}
            </div>
            <Fav isHome={true} onclick={handleAddStatment} />
        </ScreenSlide>
    ) : (
        <ScreenFadeIn className="page__main">
            <div className="wrapper">
                <h2>{t("Main Page")}</h2>

                {statements.map((statement) => (
                    <MainCard
                        key={statement.statement.statementId}
                        statement={statement.statement}
                    />
                ))}
            </div>
            <Fav isHome={true} onclick={handleAddStatment} />
        </ScreenFadeIn>
    );
};

export default Main;
