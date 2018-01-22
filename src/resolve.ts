import { Issue, NateraStatus, ApsisStatus, StatusLabel, sprintId, getStatusLabels } from './issues';
import { Diff, AssigneeDiff, SprintDiff, StatusDiff, isUnchanged, labelToAdd, labelsToRemove } from './diff';
import { JiraClient } from './jira_api';

export interface Resolution {
    readonly responses: ReadonlyArray<any>;
    readonly error: Error | null;
}

export function resolve(diffs: ReadonlyArray<Diff>, apsisClient: JiraClient): ReadonlyArray<[Diff, Resolution]> {
    diffs.map((diff): [Diff, any] => {
        const resolution = { responses: [], error: null };
        try {
            if (diff.target === null) {
                // const response = await apsisClient.getIssue()
            } else {
                // TODO: START_HERE
            }
        } catch (error) {
            resolution.error = error;
        }
        return [diff, resolution];
    });

    return [];
}
