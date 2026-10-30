'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {
    DAILY_DEDUCTIONS,
    applyScheduledDeductions,
    convertScheduledQuantity,
    getDateKey
} = require('./kitchen-schedule');

const runSchedule = (options = {}) => applyScheduledDeductions({
    currentData: options.currentData || { items: {}, transactions: {} },
    dateKey: options.dateKey || '2026-10-27',
    runAt: options.runAt || '2026-10-26T18:35:00.000Z',
    transactionIdFor: (key) => `${options.dateKey || '2026-10-27'}-${key}`
});

test('daily scheduled deductions convert units and record stock transactions', () => {
    const data = {
        items: {
            atta: { name: 'Atta', unit: 'KG', stock: 8, minimumStock: 1 },
            rice: { name: 'Rice', unit: 'Gram', stock: 1200, minimumStock: 0 },
            oil: { name: 'Saarso Oil', unit: 'Millilitre', stock: 500, minimumStock: 0 }
        },
        transactions: {}
    };

    const result = runSchedule({ currentData: data });

    assert.equal(result.run.entries['atta-daily'].status, 'deducted');
    assert.equal(result.data.items.atta.stock, 4);
    assert.equal(result.data.items.rice.stock, 400);
    assert.equal(result.data.items.oil.stock, 300);
    assert.equal(result.data.transactions['2026-10-27-rice-daily'].quantity, 800);
    assert.equal(result.data.transactions['2026-10-27-sarso-oil-daily'].quantity, 200);
});

test('short stock is not deducted and the skipped amount is recorded', () => {
    const result = runSchedule({
        currentData: {
            items: { atta: { name: 'Atta', unit: 'KG', stock: 2, minimumStock: 0 } },
            transactions: {}
        }
    });

    assert.equal(result.data.items.atta.stock, 2);
    assert.equal(result.run.entries['atta-daily'].status, 'skipped');
    assert.equal(result.run.entries['atta-daily'].shortage, 2);
    assert.match(result.run.entries['atta-daily'].reason, /Insufficient stock/);
    assert.equal(Object.keys(result.data.transactions).length, 0);
});

test('missing scheduled ingredients are created at zero and shortages are recorded', () => {
    const result = runSchedule();
    const atta = Object.values(result.data.items).find((item) => item.name === 'Atta');

    assert.ok(atta);
    assert.equal(atta.stock, 0);
    assert.equal(atta.unit, 'KG');
    assert.equal(result.run.entries['atta-daily'].status, 'skipped');
});

test('weekly ingredients are deducted on Monday in India time', () => {
    const mondayRunAt = '2026-10-26T00:05:00+05:30';
    const data = {
        items: {
            dal: { name: 'Dal', unit: 'KG', stock: 3, minimumStock: 0 },
            refined: { name: 'Refined Oil', unit: 'Litre', stock: 2, minimumStock: 0 }
        },
        transactions: {}
    };
    const result = runSchedule({
        currentData: data,
        dateKey: '2026-10-26',
        runAt: mondayRunAt
    });

    assert.equal(result.data.items.dal.stock, 1.5);
    assert.equal(result.data.items.refined.stock, 1);
    assert.equal(result.run.entries['dal-weekly'].status, 'deducted');
    assert.equal(result.run.entries['refined-oil-weekly'].status, 'deducted');
});

test('weekly ingredients are not deducted on other weekdays', () => {
    const data = {
        items: { dal: { name: 'Dal', unit: 'KG', stock: 3, minimumStock: 0 } },
        transactions: {}
    };
    const result = runSchedule({
        currentData: data,
        dateKey: '2026-10-27',
        runAt: '2026-10-26T18:35:00.000Z'
    });

    assert.equal(result.run.entries['dal-weekly'], undefined);
    assert.equal(result.data.items.dal.stock, 3);
});

test('a repeated scheduled date is idempotent', () => {
    const first = runSchedule();
    const beforeTransactions = Object.keys(first.data.transactions).length;
    const second = runSchedule({ currentData: first.data });

    assert.equal(second.committed, false);
    assert.equal(Object.keys(second.data.transactions).length, beforeTransactions);
    assert.equal(second.data.items['scheduled-atta-daily'].stock, 0);
});

test('daily schedule contains the specified 15 ingredients', () => {
    assert.equal(DAILY_DEDUCTIONS.length, 15);
});

test('dates are derived in India Standard Time', () => {
    assert.equal(getDateKey(new Date('2026-10-28T18:35:00.000Z')), '2026-10-29');
});

test('only compatible mass and volume units are converted', () => {
    assert.equal(convertScheduledQuantity(4, 'KG', 'Gram'), 4000);
    assert.equal(convertScheduledQuantity(1, 'Litre', 'Millilitre'), 1000);
    assert.equal(convertScheduledQuantity(1, 'KG', 'Litre'), null);
});

test('schedule module exposes the same API to browser scripts', () => {
    const browserContext = vm.createContext({});
    const source = fs.readFileSync(require.resolve('./kitchen-schedule'), 'utf8');
    vm.runInContext(source, browserContext);

    assert.equal(typeof browserContext.KitchenSchedule.applyScheduledDeductions, 'function');
    assert.equal(browserContext.KitchenSchedule.getDateKey(new Date('2026-10-28T18:35:00.000Z')), '2026-10-29');
});
