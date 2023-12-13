import { useEffect, useState } from "react";

// Third party imports
import { Outlet, useLocation, useParams } from "react-router-dom";
import { StatementSubscription } from "delib-npm";
import { t } from "i18next";

// Redux Store
import {
    useAppDispatch,
    useAppSelector,
} from "../../../functions/hooks/reduxHooks";
import {
    deleteSubscribedStatement,
    setStatementSubscription,
} from "../../../model/statements/statementsSlice";

// Helpers
import { listenStatmentsSubsciptions } from "../../../functions/db/statements/getStatement";
import useAuth from "../../../functions/hooks/authHooks";
import ScreenSlide from "../../components/animation/ScreenSlide";
import HomeHeader from "./HomeHeader";
import { getSigniture } from "../../../functions/db/users/getUserDB";
import Modal from "../../components/modal/Modal";
import { userSelector } from "../../../model/users/userSlice";

//css
import styles from "./Home.module.scss";
import { logOut } from "../../../functions/db/auth";
import { updateUserAgreement } from "../../../functions/db/users/setUsersDB";

export const listenedStatements = new Set<string>();

export default function Home() {
    const dispatch = useAppDispatch();
    const isLgged = useAuth();
    const { statementId } = useParams();
    const location = useLocation();
    const user = useAppSelector(userSelector);

    const [displayHeader, setDisplayHeader] = useState(true);
    const [showSignAgreement, setShowSignAgreement] = useState(false);
    const [agreement, setAgreement] = useState<string>("");

    useEffect(() => {
        if (location.pathname.includes("addStatment") || statementId) {
            setDisplayHeader(false);
        } else {
            setDisplayHeader(true);
        }
    }, [location]);

    //callbacks
    function updateStoreStSubCB(statementSubscription: StatementSubscription) {
        dispatch(setStatementSubscription(statementSubscription));
    }
    function deleteStoreStSubCB(statementId: string) {
        dispatch(deleteSubscribedStatement(statementId));
    }

    //handles

    function handleAgreement(agree: boolean) {
        if (agree) {
            setShowSignAgreement(false);
        } else {
            console.log("logout");
            logOut();
        }
    }

    //use effects

    useEffect(() => {
        let unsubscribe: Function = () => {};
        try {
            if (user) {
                unsubscribe = listenStatmentsSubsciptions(
                    updateStoreStSubCB,
                    deleteStoreStSubCB,
                    10,
                    true
                );

                //check if user signed the agreement

                if (user && user.agreement?.date && user.agreement.text) {
                    console.log("user signed the agreement");
                    setShowSignAgreement(false);
                } else {
                    console.log("user didn't signed the agreement");
                    const agreement = getSigniture("basic");

                    if (!agreement) throw new Error("agreement not found");

                    setAgreement(agreement.text);
                    updateUserAgreement(agreement).then((isAgreed: boolean) =>
                        setShowSignAgreement(isAgreed)
                    );
                }
            }
        } catch (error) {}
        return () => {
            unsubscribe();
        };
    }, [user]);
    return (
        <ScreenSlide className="page" slideFromRight={true}>
            {displayHeader && <HomeHeader />}
            <Outlet />
            {showSignAgreement ? (
                <Modal>
                    <div className={styles.modal}>
                        <h2>{t("terms of use")}</h2>
                        <p>{t(agreement)}</p>
                        <div className="btns">
                            <div
                                className="btn"
                                onClick={() => handleAgreement(true)}
                            >
                                {t("Agree")}
                            </div>
                            <div
                                className="btn btn--danger"
                                onClick={() => handleAgreement(false)}
                            >
                                {t("Dont agree")}
                            </div>
                        </div>
                    </div>
                </Modal>
            ) : null}
        </ScreenSlide>
    );
}
