import { Collections, DeliberativeElement, StatementType } from "delib-npm";
import { db } from ".";
import { Query } from "firebase-admin/firestore";




export const getUserOptions = async (req: any, res: any) => {
    // cors(req, res, async () => {
    try {
        const userId = req.query.userId;
        const parentId = req.query.parentId;
        if (!parentId) {
            res.status(400).send({ error: "parentId is required", ok: false });
            return;
        }
        if (!userId) {
            res.status(400).send({ error: "userId is required", ok: false });
            return;
        }

        const userOptionsRef = db.collection(Collections.statements).where("creatorId", "==", userId).where("parentId", "==", parentId).where("statementType", "in", ["result", "option"]);
        const userOptionsDB = await userOptionsRef.get();
        const statements = userOptionsDB.docs.map((doc) => doc.data());

        res.send({ statements, ok: true });
        return;

    } catch (error: any) {
        res.status(500).send({ error: error.message, ok: false });
        return;
    }
 
}

export const getRandomStatements = async (req: any, res: any) => {


    try {

        const parentId = req.query.parentId;
        let limit = Number(req.query.limit) || 10 as number;
        if (limit > 50) limit = 50;


        if (!parentId) {
            res.status(400).send({ error: "parentId is required", ok: false });
            return;
        }


        if (!parentId) {
            res.status(400).send({ error: "parentId is required", ok: false });
            return;
        }


        const allSolutionStatementsRef = db.collection(Collections.statements);
        const q: Query = allSolutionStatementsRef.where("parentId", "==", parentId).where("statementType", "in", ["result", "option"]);
        const allSolutionStatementsDB = await q.get();
        const allSolutionStatements = allSolutionStatementsDB.docs.map((doc) => doc.data());

        //randomize the statements and return the first 10 (or limit give by the client)
        allSolutionStatements.sort(() => Math.random() - 0.5);
        const randomStatements = allSolutionStatements.splice(0, limit);

        res.send({ randomStatements, ok: true });

    } catch (error: any) {
        res.status(500).send({ error: error.message, ok: false });
        return;
    }
    // })
}

export const getTopStatements = async (req: any, res: any) => {
    // cors(req, res, async () => {
    try {

        const parentId = req.query.parentId;
        let limit = Number(req.query.limit) || 10 as number;
        if (limit > 50) limit = 50;

        if (!parentId) {
            res.status(400).send({ error: "parentId is required", ok: false });
            return;
        }

        const topSolutionsRef = db.collection(Collections.statements);
        const q: Query = topSolutionsRef.where("parentId", "==", parentId).where("statementType", "in", ["result", "option"]).orderBy("consensus", "desc").limit(limit);
        const topSolutionsDB = await q.get();
        const topSolutions = topSolutionsDB.docs.map((doc) => doc.data());

        res.send({ topSolutions, ok: true });
        return;

    } catch (error: any) {
        res.status(500).send({ error: error.message, ok: false });
        return;
    }
    // })
}

export async function hashPassword(req:any, res:any){
    try {
        //req -> {password}
        //set hash password in the statementPassword collection

        // if(ok) --> res.send({ok:true, error:null})
        // else --> res.send({ok:false, error:error.message})
    } catch (error:any) {
        res.status(500).send({ error: error.message, ok: false });
        return;
    }
}

export async function checkPassword(req:any, res:any){
    try {
        //req -> {password}
        //get hash password form the statementPassword collection

        // if(true) --> res.send({ok:true})
        // else --> res.send({ok:false})
    } catch (error:any) {
        res.status(500).send({ error: error.message, ok: false });
        return;
    }
}

export async function maintainRole(req:any, res:any){
    try {
        const subscriptionsRef = db.collection(Collections.statementsSubscribe);
        const q = subscriptionsRef.where("role", "==", "statement-creator");
        const subscriptionsDB = await q.get();
        //update the role statement-creator to admin
        const batch = db.batch();
        subscriptionsDB.docs.forEach((doc) => {
            const ref = subscriptionsRef.doc(doc.id);
            batch.update(ref, { role: "admin" });
        });
        await batch.commit();
res.send({ ok: true });
    } catch (error:any) {
        res.status(500).send({ error: error.message, ok: false });
        return;
    }
}

export async function maintainDeliberativeElement(req:any, res:any){
    try {
       const statementsRef = db.collection(Collections.statements);
         const q = statementsRef.where("statementType", "!=", "aa");
            const statementsDB = await q.get();
        
            //update statementType to deliberativeElements
        const batch = db.batch();
        statementsDB.docs.forEach((doc) => {
            const ref = statementsRef.doc(doc.id);
            if(doc.data().statementType === "option"){
            batch.update(ref, { deliberativeElement: DeliberativeElement.option });
            }else if(doc.data().statementType === "result"){
            batch.update(ref, { deliberativeElement: DeliberativeElement.option, isResult: true });
            } else if(doc.data().statementType === StatementType.question){
            batch.update(ref, { deliberativeElement: DeliberativeElement.research });

            } else {
            batch.update(ref, { deliberativeElement: DeliberativeElement.general });
            }


        });

        await batch.commit();
        res.send({ ok: true });
    } catch (error:any) {
        res.status(500).send({ error: error.message, ok: false });
        return;
    }
}
