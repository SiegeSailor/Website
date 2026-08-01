---
paths:
  - "**/*"
---

# Conventions

These standards are followed throughout:

- [AWS Tagging Best Practices and Strategies](https://docs.aws.amazon.com/tag-editor/latest/userguide/best-practices-and-strats.html), including [cost visibility](https://aws.amazon.com/blogs/aws-cloud-financial-management/gs-create-and-enforce-your-tagging-strategy-for-more-granular-cost-visibility/), on every deployed resource
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) on every commit message
- [GitHub Community Standards](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions) on the community health files
- [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) on the JavaScript, TypeScript, and Markdown
- [Shell Style Guide](https://google.github.io/styleguide/shellguide.html) on the shell scripts
- [Terraform Style Guide](https://developer.hashicorp.com/terraform/language/style) on `infrastructure/`

And these repository rules:

- **Keep Code Comments Minimal**: State only the constraints the code cannot show
- **Match Adjacent Files**: Follow the format and style of the files beside what is being added or edited

The documents follow [`documentation.md`](./documentation.md), which owns which document a fact belongs to and the writing style all of them share.
