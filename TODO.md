# TODOs

## Next Steps
- Add usernames to the secrets file so they can be configured with passwords.  Populate them with bin/init.sh
- We may need a little utility to grab sprint IDs given an issue key if there's no easy way to get this from the website.
- Come up with a proper config format (and/or accept CLI args?) for stuff like which sprint to check against.  
- Start prototyping API to resolve diffs (including Agile API for sprint scheduling)
- Add createIssue, updateIssue, and serialize methods to the JiraClient & children
- Consider making everything readonly (tslint-immutable)
- Improve file structure/organization
- Set up automatic node version switching?
    - Or, try to make npm scripts run with nvm (note: seems impossible)?
- Add some of our usual developer tooling, e.g. githooks, init script, post-checkout script...
- Consider using some kind of "app account key" rather than authenticating as an individual user

## Unit Testing Backlog
- Diff algorithm
- CSV generation (especially the row transform, but also file creation?)
- General deserialization and serialization

## Questions
- What search scope should we use for Apsis issues?
    - Probably at least the current/configured sprint(s) + backlog.  Do we want to do a sanity check on missing issues too, i.e. search for anything containing the tag in its summary, in case it was left in an earlier sprint?
- Do we want to ignore any Natera issues that map to Closed on our board? e.g. there may be stuff hanging around in "ready for release" across multiple sprints that will probably show up as missing on our side since we don't carry over closed issues.
- Is the actual current sprint always the last entry in the custom field holding sprints?  Seems this way but can't verify in docs.  We can get the current sprint with confidence from the JIRA Agile API, but only for one issue at a time, which is a bit bogus.

## Known Issues
- Clients do not currently follow pagination when doing a search, results may be incomplete
- Order JQL results by key so pagination is stable (i.e. we won't miss newly added issues during pagination)
- Looks like agile estimate is tied to a board id (a.k.a. rapid view id) so may not be resolved to the same customfield across all natera issues (or even within a project?).  May need to add this to our config.

## Long Term
- Improve documentation, include architecture/outline description
- Set up vagrant or docker to not require installing nvm/node on developer machines? (lower priority)
- Plan seminar on the project itself and/or TypeScript/Code experience
