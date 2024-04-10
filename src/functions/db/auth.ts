import {
    getAuth,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInAnonymously,
    Unsubscribe,
} from "firebase/auth";
import { app } from "./config";
import { parseUserFromFirebase, User } from "delib-npm";
import { NavigateFunction } from "react-router-dom";

// Helper functions
import { setUserToDB } from "./users/setUsersDB";

// Redux store imports
import { AppDispatch } from "../../model/store";
import { setFontSize, setUser } from "../../model/users/userSlice";
import { resetStatements } from "../../model/statements/statementsSlice";
import { resetEvaluations } from "../../model/evaluations/evaluationsSlice";
import { resetVotes } from "../../model/vote/votesSlice";
import { resetResults } from "../../model/results/resultsSlice";
import { setInitLocation } from "../../model/location/locationSlice";

const provider = new GoogleAuthProvider();

export const auth = getAuth(app);

export function googleLogin() {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential?.accessToken;

            // The signed-in user info.
            // const user = result.user;
            console.info("user signed in with google ", result.user);

            // IdP data available using getAdditionalUserInfo(result)
            // ...
        })
        .catch((error) => {
            // Handle Errors here.
            // const errorCode = error.code;
            // const errorMessage = error.message;
            // The email of the user's account used.
            // const email = error.customData.email;

            // The AuthCredential type that was used.
            console.error(error);

            // const credential = GoogleAuthProvider.credentialFromError(error);

            // ...
        });
}
export const listenToAuth =
    (dispatch: AppDispatch) =>
    (
        isAnonymous: boolean,
        navigate: NavigateFunction,
        initialUrl: string,
    ): Unsubscribe => {
        return onAuthStateChanged(auth, async (userFB) => {
            try {
                if (!userFB && isAnonymous !== true) {
                    navigate("/");
                }
                if (isAnonymous && !userFB) {
                    signAnonymously();
                }
                if (userFB) {
                    // User is signed in
                    const user = { ...userFB };
                    if (!user.displayName)
                        user.displayName =
                            localStorage.getItem("displayName") ||
                            `Anonymous ${Math.floor(Math.random() * 10000)}`;
                    const _user = parseUserFromFirebase(user);

                    // console.info("User is signed in")
                    if (!_user) throw new Error("user is undefined");

                    const userDB = (await setUserToDB(_user)) as User;

                    const fontSize = userDB.fontSize ? userDB.fontSize : defaultFontSize;

                    dispatch(setFontSize(fontSize));

                    document.body.style.fontSize = fontSize + "px";

                    if (!userDB) throw new Error("userDB is undefined");
                    dispatch(setUser(userDB));

                    if (initialUrl) navigate(initialUrl);
                } else {
                    // User is not logged in.
                    dispatch(resetStatements());
                    dispatch(resetEvaluations());
                    dispatch(resetVotes());
                    dispatch(resetResults());
                    dispatch(setUser(null));
                }
            } catch (error) {
                console.error(error);
            }
        });
    };

export function logOut(dispatch: AppDispatch) {
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            console.info("Sign-out successful.");
            dispatch(setInitLocation("/home"));
        })
        .catch((error) => {
            // An error happened.
            console.error(error);
        });
}

export function signAnonymously() {
    signInAnonymously(auth)
        .then(() => {
            console.info("user signed in anounymously");
        })
        .catch((error) => {
            console.error(error);
        });
}
