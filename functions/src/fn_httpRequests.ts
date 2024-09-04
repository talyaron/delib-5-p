import { Collections, getStatementSubscriptionId, Password, Statement, User } from "delib-npm";
import { db } from ".";
import { Query } from "firebase-admin/firestore";
import * as bcrypt from "bcrypt";
// import { collection, addDoc } from "firebase/firestore";
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
    const userOptionsRef = db
      .collection(Collections.statements)
      .where("creatorId", "==", userId)
      .where("parentId", "==", parentId)
      .where("statementType", "in", ["result", "option"]);
    const userOptionsDB = await userOptionsRef.get();
    const statements = userOptionsDB.docs.map((doc) => doc.data());
    res.send({ statements, ok: true });
    return;
  } catch (error: any) {
    res.status(500).send({ error: error.message, ok: false });
    return;
  }
};
export const getRandomStatements = async (req: any, res: any) => {
  try {
    const parentId = req.query.parentId;
    let limit = Number(req.query.limit) || (10 as number);
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
    const q: Query = allSolutionStatementsRef
      .where("parentId", "==", parentId)
      .where("statementType", "in", ["result", "option"]);
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
};
export const getTopStatements = async (req: any, res: any) => {
  // cors(req, res, async () => {
  try {
    const parentId = req.query.parentId;
    let limit = Number(req.query.limit) || (10 as number);
    if (limit > 50) limit = 50;
    if (!parentId) {
      res.status(400).send({ error: "parentId is required", ok: false });
      return;
    }
    const topSolutionsRef = db.collection(Collections.statements);
    const q: Query = topSolutionsRef
      .where("parentId", "==", parentId)
      .where("statementType", "in", ["result", "option"])
      .orderBy("consensus", "desc")
      .limit(limit);
    const topSolutionsDB = await q.get();
    const topSolutions = topSolutionsDB.docs.map((doc) => doc.data());
    res.send({ topSolutions, ok: true });
    return;
  } catch (error: any) {
    res.status(500).send({ error: error.message, ok: false });
    return;
  }
  // })
};

export async function hashPassword(req: any, res: any) {
  try {
    const { statementId, plainPassword } = req.body;

    if (!plainPassword || !statementId) {
      throw new Error("Password and statementId are required");
    }

    const saltRounds = 10;
    const stringifiedPlainPassword = plainPassword.toString();
    const hashPassword = await bcrypt.hash(stringifiedPlainPassword, saltRounds);

    if (!hashPassword) return res.status(500).json({ ok: false, error: "Password could not be hashed" });

    const docRef = db.collection(Collections.statementsPasswords).doc(statementId);

    await docRef.set({
      statementId,
      hashPassword,
    });
    return res.status(200).send({ ok: true, docRef: docRef.id });
  } catch (error: any) {
    console.error("Error hashing password:", error);
    return res.status(500).send({ ok: false, error: error.message });
  }
}

export async function checkPassword(req: any, res: any) {
  try {
    const { userCodeInput, statementId, userId } = req.body;

    if (!userCodeInput || !statementId || !userId) {
      return res.status(400).json({ error: "User code input, statement ID, and user ID are required", ok: false });
    }

    const [passwordDB, userDB, statementDB] = await Promise.all([
      db.collection(Collections.statementsPasswords).doc(statementId).get(),
      db.collection(Collections.users).doc(userId).get(),
      db.collection(Collections.statements).doc(statementId).get(),
    ]);
    
    if (!passwordDB.exists) {
      return res.status(404).json({ error: "Statement ID not found", ok: false });
    }

    if (!userDB.exists) {
      return res.status(404).json({ error: "User ID not found", ok: false });
    }

    if (!statementDB.exists) {
      return res.status(404).json({ error: "Statement ID not found", ok: false });
    }

    const passwordData = passwordDB.data() as Password;
    const user = userDB.data() as User;
    const statement = statementDB.data() as Statement;
    const hashedPassword = passwordData.hashPassword;
    const subscriptionId = getStatementSubscriptionId(statementId, user);

    if (!subscriptionId) {
      return res.status(404).json({ error: "Subscription ID not found", ok: false });
    }
    if (!hashedPassword) {
      return res.status(500).json({ error: "No hashed password found for this statement", ok: false });
    }

    const stringifiedPassword = userCodeInput.toString();
    const match = await bcrypt.compare(stringifiedPassword, hashedPassword);

    if (match && user.role !== "admin") {
      const newSubscription = {
        role: "member",
        userId,
        statementId,
        lastUpdate: Date.now(),
        statementsSubscribeId: subscriptionId,
        statement,
        notification: false,
        user,
        userAskedForNotification: false,
      };

      await db.collection(Collections.statementsSubscribe).doc(subscriptionId).set(newSubscription);

      return res.status(200).send({ ok: true, message: "Password match and subscription created" });
    } else {
      return res.status(401).send({ ok: false, message: "Password and hashed password don't match" });
    }
  } catch (error: any) {
    console.error("Error checking password:", error);
    return res.status(500).send({ error: error.message, ok: false });
  }
}
