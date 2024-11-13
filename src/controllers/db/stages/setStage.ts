import { DeliberationMethod } from "@/model/deliberation/deliberationMethodsModel";
import { Collections, Stage, Statement } from "delib-npm";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { FireStore } from "../config";

export async function setStageToDB({ statement, deliberationMethod }: { statement: Statement, deliberationMethod: DeliberationMethod }): Promise<Stage | undefined>{
    try {
       
        const newStage = await createStage({ statement, deliberationMethod });
        if (!newStage) throw new Error("Error creating stage");
console.log(Collections.stages, newStage.stageId);
        const stageRef = doc(FireStore, Collections.stages, newStage.stageId)
        await setDoc(stageRef, newStage);
        
        return newStage;

    } catch (error) {
        console.error(error);
        
        return undefined;
    }
}

async function createStage({ statement, deliberationMethod }: { statement: Statement, deliberationMethod: DeliberationMethod }): Promise<Stage | undefined> {
    try {
        const stagesRef = collection(FireStore, Collections.stages);
        const stagesDB = await getDocs(stagesRef);
        console.log(stagesDB.size);

        return {
            statementId: statement.statementId,
            stageId: crypto.randomUUID(),
            title: deliberationMethod.title,
            description: deliberationMethod.description,
            image: deliberationMethod.image || deliberationMethod.defaultImage,
            method: deliberationMethod.title,
            order: stagesDB.size + 1,
        }
    } catch (error) {
        console.error(error);

        return undefined;
    }
}