import { useEffect, useState } from "react";
import "../../style/homePage.scss";
import { useNavigate } from "react-router-dom";
import { StatementSubscription } from "delib-npm";
import { useAppSelector } from "../../../controllers/hooks/reduxHooks";
import { statementsSubscriptionsSelector } from "../../../model/statements/statementsSlice";
import Footer from "../../components/footer/Footer";
import ScreenSlide from "../../components/animation/ScreenSlide";
import PeopleLoader from "../../components/loaders/PeopleLoader";
import MainCard from "./mainCard/MainCard";

const Main = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const statements: StatementSubscription[] = useAppSelector(
    statementsSubscriptionsSelector
  )
    .filter((s) => s.statement.parentId === "top")
    .sort((a, b) => b.lastUpdate - a.lastUpdate);

  function handleAddStatement() {
    navigate("/home/addStatement", {
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
    <div className="main-container">
      <div className="scrollable-content">
        <img
          className="heroImg"
          src="/src/assets/images/heroX4.png"
          alt="Hero"
        />
        <img className="bikeImg" src="/src/assets/images/bike.png" alt="Bike" />
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
          <Footer onclick={handleAddStatement} />
        </ScreenSlide>
      </div>
    </div>
  );
};

export default Main;
