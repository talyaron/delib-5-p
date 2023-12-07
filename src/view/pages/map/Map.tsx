import React from "react";

// Third party libraries
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

// Custom components
import ScreenSlide from "../../components/animation/ScreenSlide";

// Hooks
import useSortStatements from "../../../functions/hooks/useSortStatements";

export default function Map() {
    const navigate = useNavigate();
    const location = useLocation();
    const { statementId } = useParams();

    const slideLeft = location.state.from.includes("/map");

    const results = useSortStatements();

    return statementId ? (
        <Outlet />
    ) : (
        <ScreenSlide className="page" toSubStatement={!slideLeft}>
            <div className="page__main">
                <div className="wrapper">
                    {results.map((result, index) => (
                        <button
                            key={index}
                            onClick={() =>
                                navigate(`${result.top.statementId}`, {
                                    state: { from: window.location.pathname },
                                })
                            }
                        >
                            {result.top.statement}
                        </button>
                    ))}
                </div>
            </div>
        </ScreenSlide>
    );
}
