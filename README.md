# gh-project-plugin

Codex plugin bundle for low-friction GitHub repository creation with
default-first planning, native menu prompts, explicit confirmation,
discoverability topics, and deterministic local cloning for new project setup.

## What This Plugin Provides

`gh-project-plugin` packages the `gh-project` skill as the behavioral source of
truth for creating GitHub repositories from Codex. The workflow infers strong
defaults, presents every configurable setting through native menu prompts, checks
for local and remote collisions, and creates the repository only after the user
selects `Create GitHub project`.

In this plugin, "GitHub project" means a GitHub repository unless the user
explicitly asks for a GitHub Projects board.

## Prerequisites

- Codex with plugin and skill support.
- Codex host support for `request_user_input` in the current chat mode. This is
  the native menu surface used by the production workflow.
- GitHub CLI installed as `gh`.
- An authenticated `gh` session with permission to create repositories.
- Node.js 18 or newer for the bundled MCP probe.

## Native Menu Contract

The seamless menu experience depends on the Codex host exposing the native
`request_user_input` tool. The skill instructs Codex to stop if that integrated
menu surface is unavailable. It must not degrade to numbered Markdown menus,
hidden defaults, or a prose-only checklist.

The bundled MCP server is retained as a menu-surface probe. It verifies that MCP
elicitation can make a structured round trip, but it is not the production
repository-creation engine. Desktop testing showed MCP elicitation alone did not
render the desired Plan-style native menu in the tested Codex Desktop build.

## Safety Contract

The workflow is intentionally narrow:

- resolve `gh --version` and `gh auth status` before planning;
- infer defaults, then show every configurable setting;
- check local folder and GitHub repository collisions before mutation;
- create only after explicit `Create GitHub project` confirmation;
- use one deterministic `gh repo create` path;
- add topics with `gh repo edit`;
- stop on blockers instead of trying alternate creation paths.

## Validation

Run the local probe and package dry run before publishing changes:

```bash
npm run probe
npm run pack:dry-run
```

Full local validation:

```bash
npm run validate
diff -u /Users/velocityworks/.codex/skills/gh-project/SKILL.md skills/gh-project/SKILL.md
codex mcp list
```

## Specification

- [Plugin specification](spec.html)
- [Native menu surface research](research/native-menu-surface.html)
- [Release readiness checklist](release-readiness-checklist.md)
