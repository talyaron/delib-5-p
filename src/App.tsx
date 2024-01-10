import { useEffect, useState } from "react";

// Third party imports
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
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
import { User } from "delib-npm";

// Custom components
import Accessiblity from "./view/components/accessibility/Accessiblity";
import { resetStatements } from "./model/statements/statementsSlice";
import { resetEvaluations } from "./model/evaluations/evaluationsSlice";
import { resetVotes } from "./model/vote/votesSlice";
import { resetResults } from "./model/results/resultsSlice";
import Modal from "./view/components/modal/Modal";

//css

import { updateUserAgreement } from "./functions/db/users/setUsersDB";
import { getSigniture } from "./functions/db/users/getUserDB";
import { Agreement } from "delib-npm";

export default function App() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { i18n } = useTranslation();
    const user = useAppSelector(userSelector);

    const [showSignAgreement, setShowSignAgreement] = useState(false);
    const [agreement, setAgreement] = useState<string>("");
    const [visualViewportHeight, setVisualViewportHeight] = useState(
        window.visualViewport?.height || 0
      );

    function updateUserToStore(user: User | null) {
        dispatch(setUser(user));
    }

    function updateFonSize(fontSize: number) {
        dispatch(setFontSize(fontSize));
    }

    function navigateToInitialLocationCB(pathname: string) {
        navigate(pathname);
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

    window.visualViewport?.addEventListener("resize", (event: any) => {
    
      setVisualViewportHeight(event.target?.height || 0);
      document.body.style.height = `${event.target?.height}px`;
   //change html height to visualViewportHeight state
        const html = document.querySelector("html");
        if (html) {
            const html = document.querySelector("html") as HTMLElement;
            html.style.height = `${event.target?.height}px`;
        }


      //chage height of .page class to visualViewportHeight state
        const page = document.querySelector(".page");
        if (page) {
            const page = document.querySelector(".page") as HTMLElement;
            page.style.height = `${event.target?.height}px`;
        }
  
    });
    return () => {
      window.removeEventListener("resize", () => {});
      window.visualViewport?.addEventListener("resize", () => {});
    };
  }, []);

    useEffect(() => {
        if (!user) {
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
    }, [user]);

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
        <div style={{height:`${visualViewportHeight}px`, overflowY:"hidden", position:"fixed", top:"0px", left:"0px"}}>
            <Accessiblity />
           
            <Outlet />
            {showSignAgreement && (
                <Modal>
                    <div className="termsOfUse">
                        <h1 className="termsOfUse__title">
                            {t("terms of use")}
                        </h1>
                        <p>{t(agreement)}</p>
                        <div className="btns">
                            <button
                                className="btn btn--agree"
                                onClick={() =>
                                    handleAgreement(true, t(agreement))
                                }
                            >
                                {t("Agree")}
                            </button>
                            <button
                                className="btn btn--disagree"
                                onClick={() =>
                                    handleAgreement(false, t(agreement))
                                }
                            >
                                {t("Dont agree")}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
