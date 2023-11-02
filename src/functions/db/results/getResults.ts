// import { doc, getDoc } from "firebase/firestore";
// import { DB } from "../config";
// import { Collections } from "delib-npm";
import { z } from "zod";

export async function getResults(statementId: string) {
    try {
        z.string().min(8).parse(statementId);

        //     const resultsRef = doc(DB, Collections.resultsTriggers, statementId);
        //     const resultsDB = await getDoc(resultsRef);
        //     const results = resultsDB.data() as Result;
        //   } catch (error) {
        //     console.error(error);
        //   }  

    } catch (error) {
        console.error(error);
    }
}