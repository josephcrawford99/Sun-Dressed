---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git branch:*), Bash(git log:*)
description: Understand the current state of the project
permission-mode: plan
---

## Context

- Read @CLAUDE.md
- Read @FEATURE.md
- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

- Perform all of the above context steps to understand the current state of the project.
- Read all files referenced in @FEATURE.md to understand the context of the feature.
- Ultrathink, then ask clarifying questions about @FEATURE.md
- provide a detailed plan to implement the feature in @FEATURE.md into the project.
