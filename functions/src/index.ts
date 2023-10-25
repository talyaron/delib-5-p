/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { updateEvaluation } from "./fn_evaluation";
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
exports.updateSubscribedListners = onDocumentUpdated("/statements/{statementId}",updateSubscribedListnersCB);

exports.updateParentWithNewMessage = onDocumentCreated("/statements/{statementId}",updateParentWithNewMessageCB);

exports.updateNotifications = onDocumentCreated("/statements/{statementId}",sendNotificationsCB);

//evaluations
exports.updateEvaluation = onDocumentWritten('/evaluations/{evaluationId}', updateEvaluation)

//votes
exports.addVote = onDocumentWritten('/votes/{voteId}', updateVote);
// exports.removeVote = onDocumentDeleted('/votes/{voteId}', removeVote);

exports.changeSignature = onDocumentCreated('/statementsSignatures/{signatureId}', addSignature);

exports.deleteSignature = onDocumentDeleted('/statementsSignatures/{signatureId}', removeSignature);

//rooms
exports.countRoomJoiners = onDocumentWritten(`${Collections.statementRoomsAsked}/{requestId}`, countRoomJoiners);