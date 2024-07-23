import { Collections, Importance } from "delib-npm";
import { logger } from "firebase-functions/v1";
import { db } from ".";
import { FieldValue } from "firebase-admin/firestore";

export async function setImportanceToStatement(event: any) {
    try {
       
        const importanceBeforeData = event.data.before.data() as Importance | undefined;
        const importanceAfterData = event.data.after.data() as Importance | undefined;
        const statementId  = importanceBeforeData?.statementId || importanceAfterData?.statementId;
        if(!statementId) throw new Error("No statement id found");
        
        const diffNumberOfUsers = (() => {
            if (importanceBeforeData && importanceAfterData) return 0;
            if (importanceBeforeData) return -1;
            if (importanceAfterData) return 1;
            return 0;
        })();

        let importanceBefore = 0;
        let importanceAfter = 0;
        if (importanceBeforeData) importanceBefore = importanceBeforeData.importance;
        if (importanceAfterData) importanceAfter = importanceAfterData.importance;
        console.log('diffNumberOfUsers', diffNumberOfUsers, 'importanceBefore', importanceBefore, 'importanceAfter', importanceAfter);

        //get section id
        const sectionId = importanceBeforeData?.parentId || importanceAfterData?.parentId;
        if (!sectionId) throw new Error("No section id found");

        //get all user importance ratings in the section
        const importances = await db.collection(Collections.importance).where("parentId", "==", sectionId).get();

        let sumImportances = 0
        importances.forEach((imp) => {
            const impData = imp.data() as Importance;
            sumImportances += impData.importance
        });



        const diffImportance = importanceAfter - importanceBefore;
        console.log('diffImportance', diffImportance);



        //update statement importance
        const statementRef = db.collection(Collections.statements).doc(statementId);
       
        await statementRef.set({ importanceData: { importance: FieldValue.increment(diffImportance), numberOfUsers: FieldValue.increment(diffNumberOfUsers) } }, { merge: true });


        return;

    } catch (error) {
        logger.error(error);
        return;
    }
}