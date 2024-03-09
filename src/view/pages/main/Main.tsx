import { useEffect, useState } from "react";

// Third party libraries
import { useNavigate } from "react-router-dom";
import { StatementSubscription } from "delib-npm";

// Redux store
import { useAppSelector } from "../../../functions/hooks/reduxHooks";
import { statementsSubscriptionsSelector } from "../../../model/statements/statementsSlice";

// Custom components
import Fav from "../../components/fav/Fav";
import ScreenSlide from "../../components/animation/ScreenSlide";
import PeopleLoader from "../../components/loaders/PeopleLoader";
import MainCard from "./mainCard/MainCard";

const Main = () => {
    // Hooks
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const statements: StatementSubscription[] = useAppSelector(
        statementsSubscriptionsSelector,
    )
        .filter((s) => s.statement.parentId === "top")
        .sort((a, b) => b.lastUpdate - a.lastUpdate);

    function handleAddStatment() {
        // navigate("/home/addStatment", {
        //     state: { from: window.location.pathname },
        // });
        navigate("/pricing-plan", {
            state: { from: window.location.pathname },
        });
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);

        if (statements.length > 0) {
            setLoading(false);
        }
    }, [statements]);

    return (
        <ScreenSlide className="page__main slide-in">
            <div
                className="wrapper"
                style={{
                    justifyContent: statements.length > 0 ? "start" : "center",
                }}
            >
                {!loading ? (
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
            <Fav onclick={handleAddStatment} />
        </ScreenSlide>
    );
};

export default Main;
