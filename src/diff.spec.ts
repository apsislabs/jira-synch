import * as assert from 'assert';
import 'mocha';

import { Issue, NateraStatus, ApsisStatus, StatusLabel } from './issues';
import { calculateDiffs, diffAssignee, diffSprint, diffStatus, Diff, AssigneeDiff, SprintDiff, StatusDiff } from './diff';

const sourceBase: Issue = {
    key: 'FOO-100',
    assignee: 'nwingham',
    labels: [],
    points: null,
    sprintId: 20,
    status: NateraStatus.Idea,
    summary: 'Test Issue',
};

const targetBase: Issue = {
    key: 'BAR-200',
    assignee: 'niall',
    labels: [],
    points: null,
    sprintId: 24,
    status: ApsisStatus.ToDo,
    summary: 'FOO-100 Test Issue',
};

const userMap = new Map([
    ['nwingham', 'niall'],
    ['ncallaway', 'noah'],
]);

const targetSprints = [24, 25];
const scheduleIn = 25;

const statusMap = new Map<NateraStatus, [ApsisStatus, StatusLabel | null]>([
    [NateraStatus.Idea, [ApsisStatus.ToDo, null]],
    [NateraStatus.CodeReview, [ApsisStatus.InReview, StatusLabel.CodeReview]],
    [NateraStatus.InQaReview, [ApsisStatus.InReview, StatusLabel.Qa]],
]);

describe('Diff Calculation', () => {
    context('Assignee', () => {
        it('Should create no diff if the target issue has the correct assignee', () => {
            const source = sourceBase;
            const target = targetBase;

            const expectedDiff = null;
            const actualDiff = diffAssignee(source, target, userMap);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });

        it('Should create a diff if the target issue is missing', () => {
            const source = sourceBase;
            const target = null;

            const expectedDiff: AssigneeDiff = { oldValue: null, newValue: 'niall' };
            const actualDiff = diffAssignee(source, target, userMap);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });

        it('Should create a diff if the target issue has the wrong assignee', () => {
            const source = sourceBase;
            const target = { ...targetBase, assignee: 'noah' };

            const expectedDiff: AssigneeDiff = { oldValue: 'noah', newValue: 'niall' };
            const actualDiff = diffAssignee(source, target, userMap);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });

        it('Should work if the source diff is unassigned', () => {
            const source = { ...sourceBase, assignee: null };
            const target = targetBase;

            const expectedDiff: AssigneeDiff = { oldValue: 'niall', newValue: null };
            const actualDiff = diffAssignee(source, target, userMap);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });

        it('Should work if the target diff is unassigned', () => {
            const source = sourceBase;
            const target = { ...targetBase, assignee: null };

            const expectedDiff: AssigneeDiff = { oldValue: null, newValue: 'niall' };
            const actualDiff = diffAssignee(source, target, userMap);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });
    });

    context('Sprint', () => {
        it('Should create no diff if the target issue is in a valid sprint', () => {
            const source = sourceBase;
            const target = targetBase;

            const expectedDiff = null;
            const actualDiff = diffSprint(source, target, targetSprints, scheduleIn);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });

        it('Should create a diff if the target issue is missing', () => {
            const source = sourceBase;
            const target = null;

            const expectedDiff: SprintDiff = { oldValue: null, newValue: 25 };
            const actualDiff = diffSprint(source, target, targetSprints, scheduleIn);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });

        it('Should create a diff if the target issue is in the wrong sprint', () => {
            const source = sourceBase;
            const target = { ...targetBase, sprintId: 26 };

            const expectedDiff: SprintDiff = { oldValue: 26, newValue: 25 };
            const actualDiff = diffSprint(source, target, targetSprints, scheduleIn);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });

        it('Should work if the target diff is in the backlog', () => {
            const source = sourceBase;
            const target: Issue = { ...targetBase, sprintId: 'backlog' };

            const expectedDiff: SprintDiff = { oldValue: 'backlog', newValue: 25 };
            const actualDiff = diffSprint(source, target, targetSprints, scheduleIn);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });
    });

    context('Status', () => {
        it('Should create no diff if the target issue has the correct status and status label', () => {
            const source = sourceBase;
            const target = targetBase;

            const expectedDiff = null;
            const actualDiff = diffStatus(source, target, statusMap);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });

        it('Should create a diff if that target issue is missing', () => {
            const source = sourceBase;
            const target = null;

            const expectedDiff: StatusDiff = {
                oldStatus: null,
                newStatus: ApsisStatus.ToDo,
                oldLabels: [],
                newLabel: null,
            };
            const actualDiff = diffStatus(source, target, statusMap);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });

        it('Should create a diff if the target issue has the correct status and wrong label', () => {
            const source = { ...sourceBase, status: NateraStatus.InQaReview };
            const target = { ...targetBase, status: ApsisStatus.InReview, labels: [StatusLabel.CodeReview] };

            const expectedDiff: StatusDiff = {
                oldStatus: ApsisStatus.InReview,
                newStatus: ApsisStatus.InReview,
                oldLabels: [StatusLabel.CodeReview],
                newLabel: StatusLabel.Qa,
            };
            const actualDiff = diffStatus(source, target, statusMap);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });

        it('Should create a diff if the target issue has the wrong status and correct label', () => {
            const source = { ...sourceBase, status: NateraStatus.InQaReview };
            const target = { ...targetBase, status: ApsisStatus.ToDo, labels: [StatusLabel.Qa] };

            const expectedDiff: StatusDiff = {
                oldStatus: ApsisStatus.ToDo,
                newStatus: ApsisStatus.InReview,
                oldLabels: [StatusLabel.Qa],
                newLabel: StatusLabel.Qa,
            };
            const actualDiff = diffStatus(source, target, statusMap);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });

        it('Should create a diff if the target issue has the wrong status and wrong label', () => {
            const source = { ...sourceBase, status: NateraStatus.InQaReview };
            const target = { ...targetBase, status: ApsisStatus.ToDo, labels: [StatusLabel.CodeReview] };

            const expectedDiff: StatusDiff = {
                oldStatus: ApsisStatus.ToDo,
                newStatus: ApsisStatus.InReview,
                oldLabels: [StatusLabel.CodeReview],
                newLabel: StatusLabel.Qa,
            };
            const actualDiff = diffStatus(source, target, statusMap);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });

        it('Should work if the target issue has more than one wrong label', () => {
            const source = sourceBase;
            const target = { ...targetBase, labels: [StatusLabel.CodeReview, StatusLabel.Uat] };

            const expectedDiff: StatusDiff = {
                oldStatus: ApsisStatus.ToDo,
                newStatus: ApsisStatus.ToDo,
                oldLabels: [StatusLabel.CodeReview, StatusLabel.Uat],
                newLabel: null,
            };
            const actualDiff = diffStatus(source, target, statusMap);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });

        it('Should ignore non-status labels', () => {
            const source = { ...sourceBase, status: NateraStatus.InQaReview };
            const target = { ...targetBase, status: ApsisStatus.InReview, labels: ['foo', 'bar', StatusLabel.CodeReview] };

            const expectedDiff = {
                oldStatus: ApsisStatus.InReview,
                newStatus: ApsisStatus.InReview,
                oldLabels: [StatusLabel.CodeReview],
                newLabel: StatusLabel.Qa,
            };
            const actualDiff = diffStatus(source, target, statusMap);

            assert.deepStrictEqual(actualDiff, expectedDiff);
        });

    });
});

describe('Diff Methods', () => {
    context('isUnchanged', () => {
        // TODO: Implement me
    });
});
