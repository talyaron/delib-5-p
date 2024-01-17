import { lazy } from "react";

// Third party libraries
import { useNavigate } from "react-router-dom";
import { statementsSubscriptionsSelector } from "../../../model/statements/statementsSlice";
import { useAppSelector } from "../../../functions/hooks/reduxHooks";

// Custom components
import Fav from "../../components/fav/Fav";

// Other
import ScreenSlide from "../../components/animation/ScreenSlide";
import PeopleLoader from "../../components/loaders/PeopleLoader";

const MainCard = lazy(() => import("./mainCard/MainCard"));

const Main = () => {
    // Hooks
    const navigate = useNavigate();

    const statements = [...useAppSelector(statementsSubscriptionsSelector)]
        .filter((state) => state.statement.parentId === "top")
        .sort((a, b) => b.lastUpdate - a.lastUpdate);

    function handleAddStatment() {
        navigate("/home/addStatment", {
            state: { from: window.location.pathname },
        });
    }

    return (
        <ScreenSlide className="page__main slide-in">
            <div className="wrapper" style={{justifyContent: statements.length > 0 ? "start": "center"}}>
                {statements.length > 0 ? (
                    statements.map((statement) => (
                        <MainCard
                            key={statement.statement.statementId}
                            statement={statement.statement}
                        />
                    ))
                ) : (
                    <PeopleLoader />
                )}
            </div>
            <Fav isHome={true} onclick={handleAddStatment} />
        </ScreenSlide>
    );
};

export default Main;
