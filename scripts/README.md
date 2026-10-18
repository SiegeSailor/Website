# scripts

The shell scripts the workflows and the operator call. Each one does a single job that would be awkward as an NPM script — here, fanning out HTTP requests. Every name reads `<technology>-<action>.sh`, so the file says which tool it drives before it is opened — [`CONTRIBUTING.md`](./CONTRIBUTING.md#adding-a-script) owns that rule.

| Script                                           | Does                                                                      | Called By |
| ------------------------------------------------ | ------------------------------------------------------------------------- | --------- |
| [`cloudfront-warm.sh`](./cloudfront-warm.sh)     | Requests every page in the deployed sitemap so CloudFront caches it again | By hand   |
| [`dynamodb-moderate.sh`](./dynamodb-moderate.sh) | Lists, approves, rejects, and replies to the site's comments              | By hand   |

## Usage

Every script runs from the repository root and refuses to run anywhere else:

```shell
bash scripts/cloudfront-warm.sh [domain] [protocol]
bash scripts/dynamodb-moderate.sh [list]
bash scripts/dynamodb-moderate.sh approve|reject <post> <id>
bash scripts/dynamodb-moderate.sh reply <post> <id> "<text>" [name]
```

Defaults: `cloudfront-warm.sh` targets `https://jinyu-zhang.com`, and exits 1 unless every page returns 200. `dynamodb-moderate.sh` lists the pending comments; the email for each new comment carries its exact `approve` and `reject` lines. A `reply` approves the comment it answers and publishes the reply as the author, by default "Jin Yu Zhang".

See [`CLAUDE.md`](./CLAUDE.md#per-script-constraints) for the constraint each script carries and [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the shape every script follows.
