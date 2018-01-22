
export type sprintId = number | 'backlog';

export interface Issue {
    readonly key: string;
    readonly summary: string;
    readonly status: string;
    readonly assignee: string | null;
    readonly labels: Array<string>;
    readonly points: number | null;
    readonly sprintId: sprintId;
}

export enum NateraStatus {
    Idea = 'Idea',
    Planning = 'Planning',
    Opened = 'Opened',
    InProgress = 'In Progress',
    Blocked = 'Blocked',
    CodeReview = 'Code Review',
    InQaReview = 'In QA Review',
    InUat = 'In UAT',
    ReadyForRelease = 'Ready for Release',
    Deployed = 'Deployed',
    Closed = 'Closed',
}

export enum ApsisStatus {
    ToDo = 'To Do',
    InProgress = 'In Progress',
    Blocked = 'Blocked',
    InReview = 'In Review',
    Done = 'Done',
}

export enum StatusLabel {
    CodeReview = 'Natera-CR',
    Qa = 'Natera-QA',
    Uat = 'Natera-UAT',
}

export function getStatusLabels(issue: Issue) {
    const statusLabels = new Set<string>(Object.values(StatusLabel));
    return issue.labels.filter(label => statusLabels.has(label));
}
