export default {
  branches: ["main"],
  plugins: [
    ["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
    ["@semantic-release/release-notes-generator", { preset: "conventionalcommits" }],
    ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
    ["@semantic-release/npm", { npmPublish: false, pkgRoot: "docker-context" }],
    ["@semantic-release/exec", { prepareCmd: "bash scripts/docker-copy.sh" }],
    [
      "@semantic-release/git",
      {
        assets: [
          "CHANGELOG.md",
          "docker-context/package.json",
          "docker-context/package-lock.json",
        ],
        message: "chore(release): ${nextRelease.version} [skip ci]",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: [{ path: "docker-context/export/resume/*" }],
        successComment: false,
        failComment: false,
        failTitle: false,
      },
    ],
  ],
};
