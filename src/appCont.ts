import { setVersion } from "./model/location/locationSlice";
import { store } from "./model/store";

export function updateVersion(dbVersion: string | undefined) {
	try {
		const dispatch = store.dispatch;

		if (dbVersion) {
			dispatch(setVersion(dbVersion));
			const LSVersion = localStorage.getItem("version");
			if (!LSVersion) {
				localStorage.setItem("version", dbVersion);
              
			} else if (LSVersion !== dbVersion) {
				console.info("new version");
				localStorage.setItem("version", dbVersion);

				//@ts-ignore
				window.location.reload(true);
              
			}
		}
	} catch (error) {
		console.error(error);

	}
}