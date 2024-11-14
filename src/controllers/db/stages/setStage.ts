import { DeliberationMethod } from "@/model/deliberation/deliberationMethodsModel";
import { Collections, Stage, StageSchema, Statement } from "delib-npm";
import { collection, doc, DocumentData, getDocs, QuerySnapshot, setDoc } from "firebase/firestore";
import { FireStore } from "../config";

export async function setStageToDB({ statement, deliberationMethod }: { statement: Statement, deliberationMethod: DeliberationMethod }): Promise<Stage | undefined>{
    try {
       
        const newStage = await createStage({ statement, deliberationMethod });
        if (!newStage) throw new Error("Error creating stage");

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

        const maxOrder = getMaxStageOrder(stagesDB);
   
        const newStage: Stage = {
            statementId: statement.statementId,
            stageId: crypto.randomUUID(),
            shortId: maxOrder + 1,
            title: deliberationMethod.title,
            description: deliberationMethod.description,
            method: deliberationMethod.title,
            order: stagesDB.size + 1,
        }
        const results = StageSchema.safeParse(newStage);
       
        if(results.success){
            return results.data;
        } else {
           console.error(results.error);

           return undefined;
        }
    } catch (error) {
        console.error(error);

        return undefined;
    }

    function getMaxStageOrder(stagesDB: QuerySnapshot<DocumentData, DocumentData>) {
        return stagesDB.docs.reduce((max, doc) => {
            const stage = doc.data() as Stage;

            return stage.order > max ? stage.order : max;
        }, 0);
    }
}