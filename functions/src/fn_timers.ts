import { logger } from "firebase-functions/v1";
import { db } from "./index";
import { Collections } from "delib-npm";

export async function cleanOldTimers() {
    try {
        logger.log("Clean old timers");
        const twoDaysAgo = new Date().getTime() - 1000 * 60 * 60 * 24 * 2;

        //timers collection ref
        const timersRef = db.collection(Collections.roomTimers);
        const oldTimersDB = await timersRef
            .where("lastUpdated", "<", twoDaysAgo)
            .get();
        if (oldTimersDB.size > 0) {
            // Delete old timers
            oldTimersDB.forEach(async (doc) => {
                try {
                    await doc.ref.delete();
                    logger.log(`Deleted timer with ID: ${doc.id}`);
                } catch (error) {
                    logger.error(
                        `Error deleting timer with ID: ${doc.id}: ${error}`,
                    );
                }
            });
        }
    } catch (error) {
        logger.error(error);
    }
}
