import { useEffect, useState } from "react";

// Third party imports
import { Outlet, useLocation, useParams } from "react-router-dom";
import { StatementSubscription } from "delib-npm";

// Redux Store
import { useAppDispatch } from "../../../functions/hooks/reduxHooks";
import {
    deleteSubscribedStatement,
    setStatementSubscription,
} from "../../../model/statements/statementsSlice";

// Helpers
import { listenStatmentsSubsciptions } from "../../../functions/db/statements/getStatement";
import useAuth from "../../../functions/hooks/authHooks";
import ScreenSlide from "../../components/animation/ScreenSlide";
import HomeHeader from "./HomeHeader";

export const listenedStatements = new Set<string>();

export default function Home() {
    const dispatch = useAppDispatch();
    const isLgged = useAuth();
    const { statementId } = useParams();
    const location = useLocation();

    const [displayHeader, setDisplayHeader] = useState(true);

    useEffect(() => {
        if (location.pathname.includes("addStatment") || statementId) {
            setDisplayHeader(false);
        } else {
            setDisplayHeader(true);
        }
    }, [location]);

    function updateStoreStSubCB(statementSubscription: StatementSubscription) {
        dispatch(setStatementSubscription(statementSubscription));
    }
    function deleteStoreStSubCB(statementId: string) {
        dispatch(deleteSubscribedStatement(statementId));
    }

    useEffect(() => {
        let unsubscribe: Function = () => {};
        if (isLgged) {
            unsubscribe = listenStatmentsSubsciptions(
                updateStoreStSubCB,
                deleteStoreStSubCB
            );
        }
        return () => {
            unsubscribe();
        };
    }, [isLgged]);
    return (
        <ScreenSlide className="page" slideFromRight={true}>
            {displayHeader && <HomeHeader />}
            <Outlet />
        </ScreenSlide>
    );
}
