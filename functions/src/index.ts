// index.ts
import { Collections } from 'delib-npm';
import {
	deleteEvaluation,
	newEvaluation,
	updateEvaluation,
} from './fn_evaluation';
import { updateResultsSettings } from './fn_results';
import { countRoomJoiners } from './fn_rooms';
import { addSignature, removeSignature } from './fn_signatures';
import {
	updateParentWithNewMessageCB,
} from './fn_statements';
import { updateVote } from './fn_vote';
import {
	onDocumentUpdated,
	onDocumentCreated,
	onDocumentWritten,
	onDocumentDeleted,
} from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { sendNotificationsCB } from './fn_notifications';
import { cleanOldTimers } from './fn_timers';
import { setAdminsToNewStatement } from './fn_roles';
import { updateStatementNumberOfMembers } from './fn_subscriptions';
import {
	getRandomStatements,
	getTopStatements,
	getUserOptions,
} from './fn_httpRequests';
import { onRequest } from 'firebase-functions/v2/https';
import { findSimilarStatements } from './fn_findSimilarStatements';
require('dotenv').config();
const express = require('express');
const app = express();

// Initialize Firebase Admin
initializeApp();
export const db = getFirestore();

const firebaseConfig = process.env.FIREBASE_CONFIG;
if (firebaseConfig) {
	console.log("Firebase Config:", JSON.parse(firebaseConfig));
}

// Define your Firestore functions
exports.checkForSimilarStatements = onRequest(
	{ cors: true },
	findSimilarStatements
);

exports.updateParentWithNewMessage = onDocumentCreated(
	`/${Collections.statements}/{statementId}`,
	updateParentWithNewMessageCB
);

exports.updateMembers = onDocumentWritten(
	`/${Collections.statementsSubscribe}/{subscriptionId}`,
	updateStatementNumberOfMembers
);

exports.updateNotifications = onDocumentCreated(
	`/${Collections.statements}/{statementId}`,
	sendNotificationsCB
);

exports.newEvaluation = onDocumentCreated(
	`/${Collections.evaluations}/{evaluationId}`,
	newEvaluation
);
exports.deleteEvaluation = onDocumentDeleted(
	`/${Collections.evaluations}/{evaluationId}`,
	deleteEvaluation
);

exports.updateEvaluation = onDocumentUpdated(
	`/${Collections.evaluations}/{evaluationId}`,
	updateEvaluation
);
exports.updateResultsSettings = onDocumentWritten(
	`${Collections.resultsTriggers}/{statementId}`,
	updateResultsSettings
);

exports.addVote = onDocumentWritten('/votes/{voteId}', updateVote);

exports.changeSignature = onDocumentCreated(
	'/statementsSignatures/{signatureId}',
	addSignature
);
exports.deleteSignature = onDocumentDeleted(
	'/statementsSignatures/{signatureId}',
	removeSignature
);

exports.countRoomJoiners = onDocumentWritten(
	`${Collections.statementRoomsAsked}/{requestId}`,
	countRoomJoiners
);

exports.cleanTimers = onSchedule('every day 00:00', cleanOldTimers);

exports.setAdminsToNewStatement = onDocumentCreated(
	`/${Collections.statements}/{statementId}`,
	setAdminsToNewStatement
);

const isProduction = process.env.NODE_ENV === 'production';
console.log('isProduction', isProduction);

const cors = { cors: ["https://delib-5.web.app"] };

exports.getTest = onRequest(cors, (req, res) => {
	const { stam } = req.query;
	res.send(`Hello world ${stam} ... isProduction: ${isProduction}, ${process.env.FUNCTION_REGION} ${process.env.GCLOUD_PROJECT}`);
});
exports.getRandomStatements = onRequest(cors, getRandomStatements);
exports.getTopStatements = onRequest(cors, getTopStatements);
exports.getUserOptions = onRequest(cors, getUserOptions);

exports.app = onRequest(cors, app);
