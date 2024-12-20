import { Collections } from "delib-npm";
import { doc, runTransaction } from "firebase/firestore";
import { FireStore } from "../config";
import { store } from "@/model/store";

export async function decreesUserSettingsLearningRemain({ evaluation, addOption }: { evaluation?: boolean, addOption?: boolean }): Promise<boolean> {
	try {
      
		if (!evaluation && !addOption) throw new Error("evaluation or addOption is required");
		const user = store.getState().user.user;
		const userSettings = store.getState().user.userSettings;
		if (!userSettings) return true;

		const finishedLearningEvaluation =  (!userSettings.learning || userSettings.learning.evaluation === undefined || userSettings.learning.evaluation <= 0);
		const finishedLearningAddOPtion = (!userSettings.learning || userSettings.learning.addOptions === undefined || userSettings.learning.addOptions <= 0);
		if ((evaluation && finishedLearningEvaluation) && (addOption && finishedLearningAddOPtion)) return true;

		if (!user) throw new Error("user is not logged in");
		if (!user.uid) throw new Error("uid is required");

		const userSettingsRef = doc(FireStore, Collections.usersSettings, user.uid);

		//transaction to update the evaluation number
		await runTransaction(FireStore, async (transaction) => {
			try {

				const userSettings = await transaction.get(userSettingsRef);
				if (!userSettings.exists()) return;
				const userSettingsData = userSettings.data();

				const _evaluation = Number(userSettingsData.learning.evaluation);
				const _addOptions = Number(userSettingsData.learning.addOptions);
				if (!_evaluation && !_addOptions) return;
				if (evaluation && _evaluation <= 0) return;
				if (addOption && _addOptions <= 0) return;

				transaction.update(userSettingsRef, {
					learning: {
						evaluation: evaluation ? _evaluation - 1 : _evaluation,
						addOptions: addOption ? _addOptions - 1 : _addOptions,
					}
				});
			} catch (error) {
				console.error(error);
			}
		});

		return true;
	} catch (error) {
		console.error(error);

		return false;
	}
}