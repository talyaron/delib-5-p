import { useEffect, useState } from "react";

// Third party imports
import { Outlet, useLocation, useParams } from "react-router-dom";

// Redux Store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../functions/hooks/reduxHooks";
import { userSelector } from "../../../model/users/userSlice";

// Helpers
import { listenToStatementSubscriptions } from "../../../functions/db/statements/listenToStatements";
import HomeHeader from "./HomeHeader";
import ScreenSlide from "../../components/animation/ScreenSlide";

export const listenedStatements = new Set<string>();

export default function Home() {
    const dispatch = useAppDispatch();
    const { statementId } = useParams();
    const location = useLocation();
    const user = useAppSelector(userSelector);

    const [displayHeader, setDisplayHeader] = useState(true);

    useEffect(() => {
        if (location.pathname.includes("addStatment") || statementId) {
            setDisplayHeader(false);
        } else {
            setDisplayHeader(true);
        }
    }, [location]);

    //use effects
    useEffect(() => {
        let unsubscribe: Promise<void> | undefined;
        try {
            if (user) {
                unsubscribe = listenToStatementSubscriptions(dispatch)(
                    user,
                    30,
                    true,
                );
            }
        } catch (error) {}

        return () => {
            if (unsubscribe) {
                unsubscribe.then((unsub) => {
                    unsub;
                });
            }
        };
    }, [user]);

    return (
        <ScreenSlide className="page slide-in">
            {displayHeader && <HomeHeader />}
            <Outlet />
        </ScreenSlide>
    );
}
