import { useEffect, useState } from "react";

// Third party imports
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { t } from "i18next";

// Firebase functions
import { listenToAuth, logOut } from "./functions/db/auth";
import { Unsubscribe } from "firebase/auth";

// Redux Store
import { useAppSelector } from "./functions/hooks/reduxHooks";
import { setFontSize, updateAgreementToStore } from "./model/users/userSlice";
import { useDispatch } from "react-redux";
import { setUser, userSelector } from "./model/users/userSlice";

// Type
import { User } from "./model/users/userModel";

// Custom components
import Accessiblity from "./view/components/accessibility/Accessiblity";
import { resetStatements } from "./model/statements/statementsSlice";
import { resetEvaluations } from "./model/evaluations/evaluationsSlice";
import { resetVotes } from "./model/vote/votesSlice";
import { resetResults } from "./model/results/resultsSlice";
import Modal from "./view/components/modal/Modal";

//css
import styles from "./App.module.scss";
import { updateUserAgreement } from "./functions/db/users/setUsersDB";
import { getSigniture } from "./functions/db/users/getUserDB";
import { Agreement } from "delib-npm";

export default function App() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { i18n } = useTranslation();
    const user = useAppSelector(userSelector);

    const [showSignAgreement, setShowSignAgreement] = useState(false);
    const [agreement, setAgreement] = useState<string>("");

    function updateUserToStore(user: User | null) {
        dispatch(setUser(user));
    }

    function updateFonSize(fontSize: number) {
        dispatch(setFontSize(fontSize));
    }

    function navigateToInitialLocationCB(pathname: string) {
        navigate(pathname, {
            state: { from: window.location.pathname },
        });
    }

    function resetStoreCB() {
        dispatch(resetStatements());
        dispatch(resetEvaluations());
        dispatch(resetVotes());
        dispatch(resetResults());
    }
    useEffect(() => {
        // Default direction is ltr
        document.body.style.direction = "ltr";

        // Get language from local storage and change accordingly
        const lang = localStorage.getItem("lang");
        if (lang) {
            i18n.changeLanguage(lang);
            document.body.style.direction =
                lang === "he" || lang === "ar" ? "rtl" : "ltr";
        }
    }, []);

    useEffect(() => {
        const usub: Unsubscribe = listenToAuth(
            updateUserToStore,
            updateFonSize,
            navigateToInitialLocationCB,
            resetStoreCB
        );

        return () => {
            usub();
        };
    }, []);

    useEffect(() => {
        //TODO: add check if you are not at start screen
        if (location.pathname === "/") return;

        if (!user) {
            navigate("/");
            return;
        }

        if (user.agreement?.date) {
            setShowSignAgreement(false);
        } else {
            const agreement = getSigniture("basic");

            if (!agreement) throw new Error("agreement not found");

            setAgreement(agreement.text);
            setShowSignAgreement(true);
        }
    }, [user, location.pathname]);

    //handles

    function handleAgreement(agree: boolean, text: string) {
        try {
            if (!text) throw new Error("text is empty");
            if (agree) {
                setShowSignAgreement(false);
                const agreement: Agreement | undefined = getSigniture("basic");
                if (!agreement) throw new Error("agreement not found");
                agreement.text = text;

                dispatch(updateAgreementToStore(agreement));

                updateUserAgreement(agreement).then((isAgreed: boolean) =>
                    setShowSignAgreement(!isAgreed)
                );
            } else {
                setShowSignAgreement(false);
                logOut();
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Accessiblity />
            <Outlet />
            {showSignAgreement ? (
                <Modal>
                    <div className={styles.modal}>
                        <h2>{t("terms of use")}</h2>
                        <p>{t(agreement)}</p>
                        <div className="btns">
                            <div
                                className="btn"
                                onClick={() =>
                                    handleAgreement(true, t(agreement))
                                }
                            >
                                {t("Agree")}
                            </div>
                            <div
                                className="btn btn--danger"
                                onClick={() =>
                                    handleAgreement(false, t(agreement))
                                }
                            >
                                {t("Dont agree")}
                            </div>
                        </div>
                    </div>
                </Modal>
            ) : null}
        </>
    );
}
