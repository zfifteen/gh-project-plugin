# Release Readiness Checklist

Use this checklist before pushing the plugin or creating a GitHub release.

## Local Package

- [ ] `.codex-plugin/plugin.json` is present.
- [ ] `skills/gh-project/SKILL.md` is present.
- [ ] `README.md` and `spec.html` are present.
- [ ] `node_modules/` is ignored and untracked.
- [ ] `npm pack --dry-run` succeeds.
- [ ] The dry-run package contains only intended plugin files.

## Behavior Contract

- [ ] The active local skill and bundled skill match:

```bash
diff -u /Users/velocityworks/.codex/skills/gh-project/SKILL.md skills/gh-project/SKILL.md
```

## Public Documentation

- [ ] `README.md` states that native menus require Codex host `request_user_input` support.
- [ ] `README.md` states that the workflow stops instead of degrading to Markdown menus.
- [ ] `spec.html` describes the full product contract.

## Stage Boundary

- [ ] No remote push has been performed for local finalization.
- [ ] No GitHub release has been created.
- [ ] Promotion has not started.
