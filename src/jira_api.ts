import axios, { AxiosInstance } from 'axios';
import { Issue, sprintId } from './issues';

interface IssueJson {
    readonly key: string;
    readonly fields: {
        readonly summary: string;
        readonly assignee: { key: string };
        readonly status: { name: string };
        readonly labels: Array<string>;
        readonly [customFieldKey: string]: any;
    };
}

interface CustomFieldKeys {
    readonly sprints: string;
    readonly points: string;
}

export class JiraClient {
    private readonly connection: AxiosInstance;
    private readonly customFieldKeys: CustomFieldKeys;

    constructor(username: string, password: string, host: string, keys: CustomFieldKeys) {
        this.connection = axios.create({
            auth: { username, password },
            baseURL: `https://${host}/rest/api/2/`,
            timeout: 10000,
        });
        this.customFieldKeys = keys;
    }

    public async getIssue(key: string): Promise<Issue> {
        const response = await this.connection.get(`issue/${key}`);
        return this.deserialize(response.data);
    }

    public async searchIssues(jql: string): Promise<ReadonlyArray<Issue>> {
        const response = await this.connection.get(`search?jql=${jql}`);
        return response.data.issues.map((json: IssueJson) => this.deserialize(json));
    }

    private deserialize(json: IssueJson): Issue {
        return {
            key: json.key,
            summary: json.fields.summary,
            status: json.fields.status.name,
            assignee: json.fields.assignee.key,
            labels: json.fields.labels,
            points: json.fields[this.customFieldKeys.points],
            sprintId: deserializeSprintId(json.fields[this.customFieldKeys.sprints]),
        };
    }
}

export function deserializeSprintId(sprints: Array<string>): sprintId {
    if (sprints.length === 0) {
        return 'backlog';
    }
    const sprint = sprints[sprints.length - 1];
    const sprintIdMatch = sprint.match(/\bid=([\d]+)\b/);
    return sprintIdMatch !== null ? parseInt(sprintIdMatch[1], 10) : 'backlog';
    // TODO: Log an error/warning if we failed to parse the sprint ID?
}

export function getJql(users: Array<string>, projects: ReadonlyArray<{project: string, sprints: ReadonlyArray<number>}>) {
    const assigneeScope = `assignee IN (${users.join(', ')})`;
    const projectScope = projects.map(p => `(project = ${p.project} AND sprint IN (${p.sprints.join(', ')}))`).join(' OR ');
    return `(${assigneeScope}) AND (${projectScope})`;
}
