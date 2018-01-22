import { NateraStatus, ApsisStatus, StatusLabel } from './issues';

export type UserMap = ReadonlyMap<string, string>;
export type StatusMap = ReadonlyMap<NateraStatus, [ApsisStatus, StatusLabel | null]>;

export const sources = [
    { project: 'EN', sprints: [454] },
    { project: 'BILL', sprints: [452] },
];

export const target = {
    project: 'NAT',
    sprints: [86, 87],
    scheduleIn: 87,
};

export const userMap: UserMap = new Map([
    ['nwingham', 'niall'],
    ['wkirby', 'admin'],
    ['ncallaway', 'noah'],
    ['cpfhol', 'chris'],
    ['egreer', 'eric'],
    ['hkeiter', 'henry'],
    ['nculver', 'nic'],
]);

export const statusMap: StatusMap = new Map<NateraStatus, [ApsisStatus, StatusLabel | null]>([
    [NateraStatus.Idea, [ApsisStatus.ToDo, null]],
    [NateraStatus.Planning, [ApsisStatus.ToDo, null]],
    [NateraStatus.Opened, [ApsisStatus.ToDo, null]],
    [NateraStatus.InProgress, [ApsisStatus.InProgress, null]],
    [NateraStatus.Blocked, [ApsisStatus.Blocked, null]],
    [NateraStatus.CodeReview, [ApsisStatus.InReview, StatusLabel.CodeReview]],
    [NateraStatus.InQaReview, [ApsisStatus.InReview, StatusLabel.Qa]],
    [NateraStatus.InUat, [ApsisStatus.InReview, StatusLabel.Uat]],
    [NateraStatus.ReadyForRelease, [ApsisStatus.Done, null]],
    [NateraStatus.Deployed, [ApsisStatus.Done, null]],
    [NateraStatus.Closed, [ApsisStatus.Done, null]],
]);
