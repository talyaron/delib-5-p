/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { updateEvaluation, updateResultsCB } from "./fn_evaluation";
import { updateResultsSettings } from "./fn_results";
import { countRoomJoiners } from "./fn_rooms";
import { addSignature, removeSignature } from "./fn_signatures";
import { updateSubscribedListnersCB,updateParentWithNewMessageCB, sendNotificationsCB } from "./fn_statements";
import { updateVote } from "./fn_vote";

// const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentUpdated,onDocumentCreated,onDocumentWritten,onDocumentDeleted } = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore")
import { Collections } from "delib-npm";

initializeApp();
export const db = getFirestore();


// update subscribers when statement is updated
//statements
exports.updateSubscribedListners = onDocumentUpdated(`/${Collections.statements}/{statementId}`,updateSubscribedListnersCB);
exports.updateResults = onDocumentUpdated(`/${Collections.statements}/{statementId}`,updateResultsCB);
exports.updateParentWithNewMessage = onDocumentCreated(`/${Collections.statements}/{statementId}`,updateParentWithNewMessageCB);

//notifications
exports.updateNotifications = onDocumentCreated(`/${Collections.statements}/{statementId}`,sendNotificationsCB);

//evaluations and results
exports.updateEvaluation = onDocumentWritten(`/${Collections.evaluations}/{evaluationId}`, updateEvaluation);
exports.updateResultsSettings = onDocumentWritten(`${Collections.resultsTriggers}/{statementId}`, updateResultsSettings);

//votes
exports.addVote = onDocumentWritten('/votes/{voteId}', updateVote);
// exports.removeVote = onDocumentDeleted('/votes/{voteId}', removeVote);

//signatures (part of delib-signatures)
exports.changeSignature = onDocumentCreated('/statementsSignatures/{signatureId}', addSignature);
exports.deleteSignature = onDocumentDeleted('/statementsSignatures/{signatureId}', removeSignature);

//rooms
exports.countRoomJoiners = onDocumentWritten(`${Collections.statementRoomsAsked}/{requestId}`, countRoomJoiners);


