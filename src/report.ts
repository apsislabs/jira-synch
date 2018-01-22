import { Diff, isUnchanged } from './diff';

import * as stringify from 'csv-stringify';
import * as fs from 'fs';

const outPath = './diff.csv';

export async function exportToCsv(diffs: ReadonlyArray<Diff>) {
    return new Promise(resolve => {
        const outStream = fs.createWriteStream(outPath);

        const stringifier = stringify();
        stringifier.pipe(outStream);
        stringifier.on('finish', resolve);

        stringifier.write(headers);
        diffs.forEach(diff => {
            const row = toRow(diff);
            stringifier.write(row);
        });
        stringifier.end();
    });
}

const headers = [
    'Natera Key',
    'Apsis Key',
    'Summary',
    'Sprint',
    'Status',
    'Assignee',
];

function toRow(diff: Diff) {
    const summary = isUnchanged(diff) ? 'Up to Date' : (diff.target ? 'Changed' : 'Created');

    let statusMessage = '';
    if (diff.status) {
        const { oldStatus, oldLabels, newStatus, newLabel } = diff.status;
        const oldValue = oldStatus + (oldLabels.length !== 0 ? ` (${oldLabels.join(', ')})` : '');
        const newValue = newStatus + (newLabel ? ` (${newLabel})` : '');
        statusMessage = `${oldValue} => ${newValue}`;
    }

    return [
        diff.source.key,
        diff.target ? diff.target.key : '',
        summary,
        diff.sprint ? `${diff.sprint.oldValue} => ${diff.sprint.newValue}` : '',
        statusMessage,
        diff.assignee ? `${diff.assignee.oldValue} => ${diff.assignee.newValue}` : '',
    ];
}
