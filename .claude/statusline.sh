#!/usr/bin/env bash
# Statusline for Claude Code: branch · node version.
# Invoked by .claude/settings.json (`statusLine.command`).
# stdin receives session JSON, ignored here.

branch=$(git branch --show-current 2>/dev/null || echo "no-git")
node_v=$(node -v 2>/dev/null || echo "no-node")

printf "%s · %s" "$branch" "$node_v"
