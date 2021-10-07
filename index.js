const {Octokit} = require("@octokit/rest")
const {retry} = require("@octokit/plugin-retry");
const {throttling} = require("@octokit/plugin-throttling");

const _Octokit = Octokit.plugin(retry, throttling);
const client = new _Octokit({
    auth: process.env.GITHUB_PAT,
    retries: 5,
    throttle: {
        onRateLimit: (retryAfter, options, octokit) => {
            octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);
            if (options.request.retryCount === 0) {
                octokit.log.info(`Retrying after ${retryAfter} seconds!`);
                return true;
            }
        },
        onAbuseLimit: (retryAfter, options, octokit) => {
            octokit.log.warn(`Abuse detected for request ${options.method} ${options.url}`);
        },
    }

});

(async function main() {
    console.log(`Retrieving repositories for the ${process.env.GITHUB_ORG} org`)
    const repos = await client.paginate(client.rest.repos.listForOrg, {
        org: process.env.GITHUB_ORG,
        type: 'all',
        per_page: 100
    })
    for (const repo of repos) {
        console.log(`Querying repo ${process.env.GITHUB_ORG}/${repo.name}`)
        const response = await client.rest.repos.getContributorsStats({
            owner: process.env.GITHUB_ORG,
            repo: repo.name
        })
        if(response.status === 202) {
            console.log(`Triggered contributions update for ${process.env.GITHUB_ORG}/${repo.name}`)
            continue
        }
        console.log(`Repository contributions already up to date for ${process.env.GITHUB_ORG}/${repo.name}`)
    }
})();
