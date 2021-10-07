# gh-contrib-update

gh-contrib-update is a CLI utility that will trigger GitHub Contributor calculation updates. It runs against
an entire org and forces the backend job on GitHub.com to recalculate all contributions to repositories.

You can run the CLI by downloading the binaries from the releases page and executing it like this:

```shell
GITHUB_PAT=<your GitHub PAT> GITHUB_ORG=<the org to update> <path to binary>/gh-contrib-update
```
