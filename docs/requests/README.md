# Work orders for Claude Code (v0.1)

Nathan and the cloud Claude ("Claudia") design and review in chat.  Claude Code, running on Nathan's machine, does the heavy building.  Jobs pass between them as work orders in this folder, so nothing depends on a chat surviving.

## How it works

1. Claudia writes a work order here: `YYYY-MM-DD-short-name.md`, using the template below.  Nathan approves it.
2. Nathan opens Claude Code in the repo, has it `git pull`, and points it at the order.
3. Claude Code builds it, following [CLAUDE.md](../../CLAUDE.md), then fills in the **Result** section of the same file, commits, and pushes.
4. Back in chat, Claudia pulls and reviews the work against the order.  Fixes become a new order or an addendum.

Only one builder works on a set of files at a time.  Always pull before starting.

## Template

```markdown
# Work order: <title> (v0.1)

**Status:** Draft / Approved / In progress / Done / Reviewed
**Written by:** Claudia, <date>.  **Approved by:** Nathan, <date>.

## Goal
One or two sentences.

## Read first
Docs and files the builder needs.

## Do
Numbered steps, small enough to check one by one.

## Do not
Anything out of scope.

## Done when
How we know it worked: tests, screenshots, numbers.

## Result (filled in by Claude Code)
What was built, commits, version number, anything left open.
```
