import { Issue, NateraStatus, ApsisStatus, sprintId, getStatusLabels } from './issues';
import { UserMap, StatusMap } from './config';
import * as _ from 'lodash';

export interface Diff {
    readonly source: Issue;
    readonly target: Issue | null;
    readonly sprint: SprintDiff | null;
    readonly assignee: AssigneeDiff | null;
    readonly status: StatusDiff | null;
}

export interface SprintDiff {
    readonly oldValue: sprintId | null;
    readonly newValue: sprintId;
}

export interface StatusDiff {
    readonly oldStatus: ApsisStatus | null;
    readonly newStatus: ApsisStatus;
    readonly oldLabels: ReadonlyArray<string>;
    readonly newLabel: string | null;
}

export interface AssigneeDiff {
    readonly oldValue: string | null;
    readonly newValue: string | null;
}

export function isUnchanged(diff: Diff) {
    return diff.target !== null && diff.sprint === null && diff.assignee === null && diff.status === null;
}

export function labelToAdd(statusDiff: StatusDiff) {
    return statusDiff.newLabel && !statusDiff.oldLabels.includes(statusDiff.newLabel) ? statusDiff.newLabel : null;
}

export function labelsToRemove(statusDiff: StatusDiff) {
    return statusDiff.oldLabels.filter(label => label !== statusDiff.newLabel);
}

export function calculateDiffs(
    sources: ReadonlyArray<Issue>,
    targets: ReadonlyArray<Issue>,
    userMap: UserMap,
    statusMap: StatusMap,
    targetSprints: Array<sprintId>,
    scheduleIn: sprintId,
): ReadonlyArray<Diff> {
    const targetsBySourceKey = _.keyBy(targets, issue => getNateraKey(issue));
    return sources.map(source => {
        const target = targetsBySourceKey[source.key] || null;
        return {
            source,
            target,
            sprint: diffSprint(source, target, targetSprints, scheduleIn),
            assignee: diffAssignee(source, target, userMap),
            status: diffStatus(source, target, statusMap),
        };
    });
}

// TODO: this might belong in a helper module
function getNateraKey(apsisIssue: Issue) {
    const match = apsisIssue.summary.match(/^[A-Z]+-[\d]+/);
    return match !== null ? match[0] : '';
}

export function diffSprint(
    source: Issue,
    target: Issue | null,
    targetSprints: Array<sprintId>,
    scheduleIn: sprintId,
): SprintDiff | null {
    const oldValue = target ? target.sprintId : null;
    const newValue = oldValue !== null && targetSprints.includes(oldValue) ? oldValue : scheduleIn;

    if (oldValue !== newValue) {
        return { oldValue, newValue };
    }
    return null;
}

export function diffAssignee(source: Issue, target: Issue | null, userMap: UserMap): AssigneeDiff | null {
    const oldValue = target ? target.assignee : null;
    const newValue = source.assignee ? userMap.get(source.assignee) || null : null;

    if (oldValue !== newValue) {
        return { oldValue, newValue };
    }
    return null;
}

export function diffStatus(source: Issue, target: Issue | null, statusMap: StatusMap): StatusDiff | null {
    const oldStatus = target ? target.status as ApsisStatus : null;
    const oldLabels = target ? getStatusLabels(target) : [];

    const [newStatus, newLabel] = statusMap.get(source.status as NateraStatus)!;
    const statusDiff = { oldStatus, newStatus, oldLabels, newLabel };

    if (oldStatus !== newStatus || labelToAdd(statusDiff) !== null || labelsToRemove(statusDiff).length !== 0) {
        return statusDiff;
    }
    return null;
}
