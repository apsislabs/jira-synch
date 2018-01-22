import { JiraClient, getJql } from './jira_api';
import { Issue } from './issues';
import { calculateDiffs } from './diff';
import { exportToCsv } from './report';

import { sources, target, userMap, statusMap } from './config';
import * as fs from 'fs';

(async () => {
    try {
        // Load API clients
        const nateraPassword = fs.readFileSync('./secrets/natera_password.txt', 'utf-8').trim();
        const nateraClient = new JiraClient('nwingham', nateraPassword, 'jira.natera.com', {
            points: 'customfield_10032',
            sprints: 'customfield_10035',
        });

        const apsisPassword = fs.readFileSync('./secrets/apsis_password.txt', 'utf-8').trim();
        const apsisClient = new JiraClient('niall@apsis.io', apsisPassword, 'apsislabs.atlassian.net', {
            points: 'customfield_10021',
            sprints: 'customfield_10016',
        });

        // Get Natera Issues
        const nateraJql = getJql([...userMap.keys()], sources);
        console.log(nateraJql);
        const nateraIssues = await nateraClient.searchIssues(nateraJql);
        nateraIssues.forEach((issue, idx) => console.log(`${idx + 1}. ${toString(issue)}`));
        console.log('');

        // Get Apsis Issues
        const apsisJql = getJql([...userMap.values()], [target]);
        console.log(apsisJql);
        const apsisIssues = await apsisClient.searchIssues(apsisJql);
        apsisIssues.forEach((issue, idx) => console.log(`${idx + 1}. (${getKey(issue.summary)}) ${toString(issue)}`));
        console.log('');

        // Pass through diff engine and export
        const diffs = calculateDiffs(nateraIssues, apsisIssues, userMap, statusMap, target.sprints, target.scheduleIn);
        await exportToCsv(diffs);

        // TODO: Update Apsis issues using API client

        // Done :)
        console.log('Done.');
    } catch (error) {
        console.error(error);
        if (error.response) {
            console.log(error.response.data.errorMessages.join('\n'));
        }
    }
})();

function toString(issue: Issue) {
    return `${issue.key}\t${issue.points}\t${issue.status}\t${issue.assignee}:\t${issue.summary}`;
}

function getKey(summary: string) {
    const match = summary.match(/^[A-Z]+-[0-9]+/);
    return match ? match[0] : null;
}
