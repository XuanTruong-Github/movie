---
name: Testing Policy
description: Test framework configuration and testing requirements
type: project
---

## Current State

- **No test framework** is configured
- **No test files** exist in the repository

## Guidance

When adding new features or fixing bugs:
- Code should be manually tested in the browser/dev environment first
- Verify both golden path and edge cases work as expected
- Monitor for regressions in related features

**Why:** The project prioritizes rapid feature shipping over automated test coverage at this stage.

**How to apply:** Focus on functional testing before reporting features complete. If you write utilities or shared logic that could benefit from unit tests, discuss with the team before adding a test framework.
