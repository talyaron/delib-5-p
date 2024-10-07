import { doc, getDoc, onSnapshot,Unsubscribe } from "firebase/firestore";
import { DB } from "../config";
import { updateVersion } from "@/appCont";

export async function getVersionFromDB(): Promise<string | undefined> {
    try {
        const versionRef = doc(DB, "version", "version");
        const versionDB = await getDoc(versionRef);
        if (!versionDB.exists()) throw new Error("version not found");
        const version = versionDB.data().version;
        if (!version) throw new Error("version not found");
        return version;
    } catch (error) {
        console.error(error);

        return undefined;

    }
}
export function listenToVersionFromDB(): Unsubscribe {
    try {
        
        const versionRef = doc(DB, "version", "version");
        return onSnapshot(versionRef, (versionDB) => {
            if (!versionDB.exists()) throw new Error("version not found");
            const version = versionDB.data().version;
            if (!version) throw new Error("version not found");
         
           updateVersion(version);
        })

    } catch (error) {
        console.error(error);

        return () => { return; };

    }
}