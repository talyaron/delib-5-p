import { useEffect, useState } from "react";

// Third party imports
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
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
import { logOut } from "../../../functions/db/auth";
import { setUser } from "../../../model/users/userSlice";
import { prompStore } from "../main/mainCont";
import { install } from "../../../main";
import { t } from "i18next";

export const listenedStatements = new Set<string>();

export default function Home() {
    const dispatch = useAppDispatch();
    const isLgged = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { statementId } = useParams();

    // const user = useAppSelector(userSelector);
    //for deffered app install
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [navigateHome, setNavigateHome] = useState(
        location.state.from.includes("map")
    );
    const [displayHeader, setDisplayHeader] = useState(true);

    useEffect(() => {
        if (location.pathname.includes("addStatment") || statementId) {
            setDisplayHeader(false);
        } else {
            setDisplayHeader(true);
        }
    }, [location]);

    useEffect(() => {
        //for defferd app install
        setDeferredPrompt(install.deferredPrompt);
    }, []);

    function updateStoreStSubCB(statementSubscription: StatementSubscription) {
        dispatch(setStatementSubscription(statementSubscription));
    }
    function deleteStoreStSubCB(statementId: string) {
        dispatch(deleteSubscribedStatement(statementId));
    }
    function handleLogout() {
        logOut();
        dispatch(setUser(null));
    }
    function handleInstallApp() {
        try {
            prompStore(setDeferredPrompt);
        } catch (error) {
            console.error(error);
        }
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
        <ScreenSlide className="page" toSubStatement={true}>
            {displayHeader && (
                <div className="page__header">
                    <div className="page__header__title">
                        <h1>{t("Delib 5")}</h1>
                        <b>-</b>
                        <h2>{t("Creating Agreements")}</h2>
                    </div>
                    <div className="btns">
                        <button onClick={handleLogout}>
                            {t("Disconnect")}
                        </button>
                        {deferredPrompt && (
                            <button onClick={handleInstallApp}>
                                {t("Install the App")}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                navigate(navigateHome ? "/home" : "map", {
                                    state: { from: window.location.pathname },
                                });
                                setNavigateHome(!navigateHome);
                            }}
                        >
                            {navigateHome ? "Home" : "Map"}
                        </button>
                    </div>
                </div>
            )}
            <Outlet />
        </ScreenSlide>
    );
}
