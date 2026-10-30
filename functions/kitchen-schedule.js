(function (root, factory) {
    const schedule = factory();
    if (typeof module === 'object' && module.exports) module.exports = schedule;
    else root.KitchenSchedule = schedule;
})(globalThis, () => {
'use strict';

const DAILY_DEDUCTIONS = [
    { key: 'atta-daily', name: 'Atta', aliases: ['wheat flour'], quantity: 4, unit: 'KG', frequency: 'daily' },
    { key: 'rice-daily', name: 'Rice', aliases: [], quantity: 0.8, unit: 'KG', frequency: 'daily' },
    { key: 'sarso-oil-daily', name: 'Sarso Oil', aliases: ['saarso oil', 'sarson oil', 'mustard oil'], quantity: 0.2, unit: 'Litre', frequency: 'daily' },
    { key: 'refined-oil-weekly', name: 'Refined Oil', aliases: ['refiend oil'], quantity: 1, unit: 'Litre', frequency: 'weekly' },
    { key: 'sugar-daily', name: 'Sugar', aliases: [], quantity: 0.4, unit: 'KG', frequency: 'daily' },
    { key: 'dal-weekly', name: 'Dal', aliases: ['lentils'], quantity: 1.5, unit: 'KG', frequency: 'weekly' },
    { key: 'macroni-weekly', name: 'Macroni', aliases: ['macaroni'], quantity: 1, unit: 'KG', frequency: 'weekly' },
    { key: 'poha-weekly', name: 'Poha', aliases: [], quantity: 1, unit: 'KG', frequency: 'weekly' },
    { key: 'kale-chane-weekly', name: 'Kale Chane', aliases: ['kala chana', 'black chana', 'black chickpeas'], quantity: 1, unit: 'KG', frequency: 'weekly' },
    { key: 'jave-weekly', name: 'Jave', aliases: ['jawa'], quantity: 1, unit: 'KG', frequency: 'weekly' },
    { key: 'mungfali-weekly', name: 'Mungfali', aliases: ['moongfali', 'peanuts'], quantity: 0.15, unit: 'KG', frequency: 'weekly' },
    { key: 'haldi-daily', name: 'Haldi', aliases: ['turmeric'], quantity: 0.015, unit: 'KG', frequency: 'daily' },
    { key: 'mirch-daily', name: 'Mirch', aliases: ['chilli', 'chili', 'chilli powder', 'chili powder'], quantity: 0.015, unit: 'KG', frequency: 'daily' },
    { key: 'jira-daily', name: 'Jira', aliases: ['jeera', 'cumin'], quantity: 0.025, unit: 'KG', frequency: 'daily' },
    { key: 'chaipatti-daily', name: 'ChaiPatti', aliases: ['chai patti', 'tea leaves'], quantity: 0.03, unit: 'KG', frequency: 'daily' }
];

const UNIT_SCALES = {
    kg: { dimension: 'mass', scale: 1000 },
    kilogram: { dimension: 'mass', scale: 1000 },
    kilograms: { dimension: 'mass', scale: 1000 },
    g: { dimension: 'mass', scale: 1 },
    gram: { dimension: 'mass', scale: 1 },
    grams: { dimension: 'mass', scale: 1 },
    litre: { dimension: 'volume', scale: 1000 },
    liter: { dimension: 'volume', scale: 1000 },
    liters: { dimension: 'volume', scale: 1000 },
    litres: { dimension: 'volume', scale: 1000 },
    l: { dimension: 'volume', scale: 1000 },
    ml: { dimension: 'volume', scale: 1 },
    millilitre: { dimension: 'volume', scale: 1 },
    milliliter: { dimension: 'volume', scale: 1 },
    millilitres: { dimension: 'volume', scale: 1 },
    milliliters: { dimension: 'volume', scale: 1 }
};

const normalizeName = (value) => String(value || '').trim().toLocaleLowerCase().replace(/\s+/g, ' ');
const normalizeUnit = (value) => String(value || '').trim().toLocaleLowerCase().replace(/[.\s_-]+/g, '');
const roundQuantity = (value) => Number(value.toFixed(3));

const convertScheduledQuantity = (quantity, fromUnit, toUnit) => {
    const from = UNIT_SCALES[normalizeUnit(fromUnit)];
    const to = UNIT_SCALES[normalizeUnit(toUnit)];
    if (!from || !to || from.dimension !== to.dimension) return null;
    return roundQuantity(quantity * from.scale / to.scale);
};

const getDateKey = (date) => {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    return `${values.year}-${values.month}-${values.day}`;
};

const getWeekday = (date) => new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long'
}).format(date);

const findMatchingItem = (items, schedule) => {
    const entries = Object.entries(items);
    const acceptedNames = [schedule.name, ...schedule.aliases].map(normalizeName);
    const matches = entries.filter(([, item]) => acceptedNames.includes(normalizeName(item?.name)));
    const canonicalMatches = matches.filter(([, item]) => normalizeName(item?.name) === normalizeName(schedule.name));
    if (canonicalMatches.length === 1) return { entry: canonicalMatches[0] };
    if (canonicalMatches.length > 1 || matches.length > 1) return { ambiguous: true };
    if (matches.length === 1) return { entry: matches[0] };
    return {};
};

const applyScheduledDeductions = ({
    currentData,
    dateKey,
    runAt,
    transactionIdFor
}) => {
    const data = currentData || {};
    data.items = data.items || {};
    data.transactions = data.transactions || {};
    data.scheduledDeductions = data.scheduledDeductions || {};
    if (data.scheduledDeductions[dateKey]) return { committed: false, data, run: data.scheduledDeductions[dateKey] };

    const run = { runAt, entries: {} };
    const schedules = DAILY_DEDUCTIONS.filter((entry) => entry.frequency === 'daily' || getWeekday(new Date(runAt)) === 'Monday');

    schedules.forEach((schedule) => {
        let match = findMatchingItem(data.items, schedule);
        if (match.ambiguous) {
            run.entries[schedule.key] = {
                itemName: schedule.name,
                status: 'skipped',
                requestedQuantity: schedule.quantity,
                requestedUnit: schedule.unit,
                shortage: schedule.quantity,
                reason: 'Multiple inventory items match this scheduled item.'
            };
            return;
        }

        let itemId;
        let item;
        if (match.entry) {
            [itemId, item] = match.entry;
        } else {
            itemId = `scheduled-${schedule.key}`;
            let suffix = 1;
            while (data.items[itemId]) {
                itemId = `scheduled-${schedule.key}-${suffix}`;
                suffix += 1;
            }
            item = {
                name: schedule.name,
                unit: schedule.unit,
                stock: 0,
                minimumStock: 0,
                createdAt: runAt,
                updatedAt: runAt
            };
            data.items[itemId] = item;
        }

        const available = Number(item.stock);
        const currentStock = Number.isFinite(available) && available >= 0 ? available : 0;
        const requestedQuantity = convertScheduledQuantity(schedule.quantity, schedule.unit, item.unit);
        if (requestedQuantity === null || requestedQuantity <= 0) {
            run.entries[schedule.key] = {
                itemId,
                itemName: item.name || schedule.name,
                status: 'skipped',
                requestedQuantity: schedule.quantity,
                requestedUnit: schedule.unit,
                available: currentStock,
                unit: item.unit || '',
                shortage: schedule.quantity,
                reason: `Inventory unit "${item.unit || '(missing)'}" is not compatible with ${schedule.unit}.`
            };
            return;
        }

        if (currentStock < requestedQuantity) {
            const shortage = roundQuantity(requestedQuantity - currentStock);
            run.entries[schedule.key] = {
                itemId,
                itemName: item.name || schedule.name,
                status: 'skipped',
                requestedQuantity,
                unit: item.unit,
                available: currentStock,
                shortage,
                reason: `Insufficient stock: ${shortage} ${item.unit} short.`
            };
            return;
        }

        const transactionId = transactionIdFor(schedule.key);
        const balance = roundQuantity(currentStock - requestedQuantity);
        item.stock = balance;
        item.updatedAt = runAt;
        data.transactions[transactionId] = {
            itemId,
            itemName: item.name || schedule.name,
            type: 'Subtracted',
            previousQuantity: currentStock,
            quantity: requestedQuantity,
            balance,
            unit: item.unit,
            timestamp: runAt,
            reason: `Scheduled ${schedule.frequency} kitchen consumption`,
            admin: 'Automatic schedule'
        };
        run.entries[schedule.key] = {
            itemId,
            itemName: item.name || schedule.name,
            status: 'deducted',
            requestedQuantity,
            unit: item.unit,
            available: currentStock,
            balance
        };
    });

    data.scheduledDeductions[dateKey] = run;
    return { committed: true, data, run };
};

return {
    DAILY_DEDUCTIONS,
    applyScheduledDeductions,
    convertScheduledQuantity,
    getDateKey,
    getWeekday
};
});
