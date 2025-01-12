import { ChoseBy, Collections, defaultChoseBySettings } from "delib-npm";
import { doc } from "firebase/firestore";
import { FireStore } from "../config";
import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { setChoseBy } from "@/model/choseBy/choseBySlice";
import { store } from "@/model/store";

export function listenToChoseBy(statementId: string | undefined): Unsubscribe {
	try {

		if (!statementId) {
			return () => { return; };
		}

		const dispatch = store.dispatch;
		const choseByRef = doc(FireStore, Collections.choseBy, statementId);

		return onSnapshot(choseByRef, (choseBySnap) => {
			if (!choseBySnap.exists()) {
				dispatch(setChoseBy(defaultChoseBySettings(statementId)));

				return;
			}

			dispatch(setChoseBy(choseBySnap.data() as ChoseBy));

			return
		});

	} catch (error) {
		console.error(error);

		return () => { return; };
	}
}