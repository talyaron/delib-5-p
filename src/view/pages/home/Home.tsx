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


// Custom Components
import HomeHeader from "./HomeHeader";
import ScreenSlide from "../../components/animation/ScreenSlide";
import { listenToStatementSubscriptions } from "../../../functions/db/subscriptions/getSubscriptions";


export const listenedStatements = new Set<string>();

export default function Home() {
    // Hooks
    const { statementId } = useParams();
    const location = useLocation();

    // Redux Store
    const dispatch = useAppDispatch();
    const user = useAppSelector(userSelector);

    // Use States
    const [displayHeader, setDisplayHeader] = useState(true);

    useEffect(() => {
        if (location.pathname.includes("addStatment") || statementId) {
            setDisplayHeader(false);
        } else {
            setDisplayHeader(true);
        }
    }, [location]);

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
