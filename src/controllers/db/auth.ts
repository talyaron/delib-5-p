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
import { AppDispatch, store } from "@/model/store";
import { setFontSize, setUser } from "@/model/users/userSlice";
import { resetStatements } from "@/model/statements/statementsSlice";
import { resetEvaluations } from "@/model/evaluations/evaluationsSlice";
import { resetVotes } from "@/model/vote/votesSlice";
import { resetResults } from "@/model/results/resultsSlice";
import { setInitLocation } from "@/model/location/locationSlice";
import { defaultFontSize } from "@/model/fonts/fontsModel";

const provider = new GoogleAuthProvider();

export const auth = getAuth(app);

export function googleLogin() {
	signInWithPopup(auth, provider)
		.then(() => {
			console.info("user signed in with google ");
		})
		.catch((error) => {
			console.error(error);
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

						if(_user?.isAnonymous){
							_user.displayName = sessionStorage.getItem("displayName") || `Anonymous ${Math.floor(Math.random() * 10000)}`;
						}

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

export function logOut() {
	const dispatch = store.dispatch;
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
