'use strict';

const { initializeApp } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const { logger } = require('firebase-functions');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { applyScheduledDeductions, getDateKey } = require('./kitchen-schedule');

initializeApp({
    databaseURL: 'https://safachattpg-default-rtdb.firebaseio.com'
});

exports.scheduledKitchenDeductions = onSchedule({
    schedule: '5 0 * * *',
    timeZone: 'Asia/Kolkata',
    region: 'asia-south1',
    timeoutSeconds: 120,
    retryCount: 3
}, async (event) => {
    const scheduledTime = new Date(event.scheduleTime || Date.now());
    const dateKey = getDateKey(scheduledTime);
    const runAt = scheduledTime.toISOString();
    const database = getDatabase();
    const rootRef = database.ref('kitchenManagement');
    let transactionId = 0;
    let duplicateRun = false;
    const result = await rootRef.transaction((currentData) => {
        const applied = applyScheduledDeductions({
            currentData,
            dateKey,
            runAt,
            transactionIdFor: (scheduleKey) => `${dateKey}-${scheduleKey}-${transactionId++}`
        });
        if (!applied.committed) {
            duplicateRun = true;
            return;
        }
        return applied.data;
    }, undefined, false);

    if (!result.committed) {
        if (duplicateRun) {
            logger.info('Scheduled kitchen deductions already recorded.', { dateKey });
            return;
        }
        throw new Error(`Scheduled kitchen deductions for ${dateKey} were not committed.`);
    }

    const entries = result.snapshot.child(`scheduledDeductions/${dateKey}/entries`).val() || {};
    const deducted = Object.values(entries).filter((entry) => entry.status === 'deducted').length;
    const skipped = Object.values(entries).filter((entry) => entry.status === 'skipped').length;
    logger.info('Scheduled kitchen deductions completed.', { dateKey, deducted, skipped });
});
