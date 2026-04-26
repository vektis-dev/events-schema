## Summary

<!-- What does this PR do? Keep it brief. -->

## Type of Change

- [ ] Bug fix (non-breaking)
- [ ] New feature (non-breaking, additive)
- [ ] Breaking schema change (bump major)
- [ ] Documentation
- [ ] Refactor (no behavior change)
- [ ] Test
- [ ] Build/CI

## Related Issues

<!-- Link related issues. Use "Closes #123" or "VEK-XXX" for Linear tickets. -->

## Schema Contract Impact

- [ ] No schema changes
- [ ] Additive only — new optional field, new enum value, looser validation (minor bump)
- [ ] Breaking — removed field, narrowed type, required field added, stricter validation (major bump)

## Release Coordination

If this PR changes the contract, the release order is **events-schema → vanalytics → tracker-js**. See [README "Release coordination"](../README.md).

## Checklist

- [ ] Self-review performed
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes
- [ ] `npm run build` produces ESM + CJS + `.d.ts`
- [ ] CHANGELOG.md updated (if user-visible change)
- [ ] README.md release-coordination section updated (if breaking)

## Notes for Reviewers

<!-- Anything specific reviewers should look at? -->
