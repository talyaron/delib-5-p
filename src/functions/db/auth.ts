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
import { setUserToDB } from "./users/setUsersDB";
import {
    getIntialLocationSessionStorage,
    setIntialLocationSessionStorage,
} from "../general/helpers";

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
export function listenToAuth(
    cb: Function,
    fontSizeCB: Function,
    navigationCB: Function,
    resetCB: Function
): Unsubscribe {
    return onAuthStateChanged(auth, async (userFB) => {
        try {
            if (!userFB) navigationCB("/");
            if (userFB) {
                // User is signed in
                const user = { ...userFB };
                if (!user.displayName)
                    user.displayName =
                        localStorage.getItem("displayName") || "anonymous";
                const _user = parseUserFromFirebase(user);

                // console.info("User is signed in")
                if (!_user) throw new Error("user is undefined");

                const userDB = (await setUserToDB(_user)) as User;

                const { fontSize } = userDB || { fontSize: 14 };

                fontSizeCB(fontSize);

               
                document.body.style.fontSize = fontSize + "px";

                if (!userDB) throw new Error("userDB is undefined");
                cb(userDB);

                const initialLocation = getIntialLocationSessionStorage();
                //navigate to initial location
                if (initialLocation) navigationCB(initialLocation);
            } else {
                // User is signed out
                console.info("User is signed out");
                resetCB();
                cb(null);
            }
        } catch (error) {
            console.error(error);
        }
    });
}

export function logOut() {
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            console.info("Sign-out successful.");
            setIntialLocationSessionStorage("/");
        })
        .catch((error) => {
            // An error happened.
            console.error(error);
        });
}

//fireabse anounymous login
// import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
// const auth = getAuth();
export function signAnonymously() {
    signInAnonymously(auth)
        .then(() => {
            console.info("user signed in anounymously");
        })
        .catch((error) => {
            console.error(error);
        });
}
