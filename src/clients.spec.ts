import * as assert from 'assert';
import 'mocha';

import { getJql, deserializeSprintId } from './jira_api';

describe('JQL Generation', () => {
    it('Should work with a single user, project, and sprint', () => {
        const users = ['nwingham'];
        const projects = [{ project: 'TEST', sprints: [1] }];

        const expectedJql = '(assignee IN (nwingham)) AND ((project = TEST AND sprint IN (1)))';
        const actualJql = getJql(users, projects);

        assert.strictEqual(actualJql, expectedJql);
    });

    it ('Should work with multiple users, projects, and sprints', () => {
        const users = ['nwingham', 'ncallaway', 'wkirby'];
        const projects = [
            { project: 'FOO', sprints: [1, 2] },
            { project: 'BAR', sprints: [3, 4] },
        ];

        const expectedJql = '(assignee IN (nwingham, ncallaway, wkirby)) AND ' +
            '((project = FOO AND sprint IN (1, 2)) OR (project = BAR AND sprint IN (3, 4)))';
        const actualJql = getJql(users, projects);

        assert.strictEqual(actualJql, expectedJql);
    });
});

describe('Deserialization', () => {
    it('Should correctly deserialize an empty array of sprints to a "backlog" sprint ID', () => {
        const sprints: Array<string> = [];
        const expectedSprintId = 'backlog';
        const actualSprintId = deserializeSprintId(sprints);

        assert.strictEqual(actualSprintId, expectedSprintId);
    });

    it('Should correctly deserialize a single sprint to its ID', () => {
        const sprints = [
            'com.atlassian.greenhopper.service.sprint.Sprint@66936d7a[id=436,rapidViewId=77,state=CLOSED,name=Sprint 33,startDate=2017-09' +
                '-25T13:42:55.028-07:00,endDate=2017-10-09T13:42:00.000-07:00,completeDate=2017-10-10T07:16:07.601-07:00,sequence=436]',
        ];
        const expectedSprintId = 436;
        const actualSprintId = deserializeSprintId(sprints);

        assert.strictEqual(actualSprintId, expectedSprintId);
    });

    it('Should select the last sprint if multiple sprints are present', () => {
        const sprints = [
            'com.atlassian.greenhopper.service.sprint.Sprint@66936d7a[id=436,rapidViewId=77,state=CLOSED,name=Sprint 33,startDate=2017-09' +
                '-25T13:42:55.028-07:00,endDate=2017-10-09T13:42:00.000-07:00,completeDate=2017-10-10T07:16:07.601-07:00,sequence=436]',
            'com.atlassian.greenhopper.service.sprint.Sprint@65c8527c[id=452,rapidViewId=77,state=ACTIVE,name=Sprint 34,startDate=2017-10' +
                '-09T07:16:24.398-07:00,endDate=2017-10-23T07:16:00.000-07:00,completeDate=<null>,sequence=452]',
        ];
        const expectedSprintId = 452;
        const actualSprintId = deserializeSprintId(sprints);

        assert.strictEqual(actualSprintId, expectedSprintId);
    });
});
