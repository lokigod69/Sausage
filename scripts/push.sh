#!/usr/bin/env bash
#
# Push to both GitHub accounts.
#
#   npm run push
#
# Why this exists. The project lives in two places and has to, for now:
#
#   origin      moeses36/Sausage     the owner's own copy, where the history
#                                    belongs and where he can always push
#   lokigod69   lokigod69/Sausage    the one Vercel deploys from. Only loki
#                                    has the Vercel account, so the deploy
#                                    hook cannot be pointed anywhere else
#                                    until that changes
#
# Both are on github.com, and `gh` presents whichever account is ACTIVE. That
# is the whole bug: pushing with moeses36 active against loki's repo returns
# "Permission to lokigod69/Sausage.git denied to moeses36", which reads like a
# missing grant and is really the wrong token. It cost several sessions.
#
# So each push switches to the account that owns the target, and the active
# account is put back to moeses36 at the end, whatever happens.
set -euo pipefail

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
HOME_ACCOUNT="moeses36"

restore() { gh auth switch -u "$HOME_ACCOUNT" >/dev/null 2>&1 || true; }
trap restore EXIT

push_as() {
  local account="$1" remote="$2"
  if ! gh auth switch -u "$account" >/dev/null 2>&1; then
    echo "  ! $remote skipped — no $account login in gh (run: gh auth login)" >&2
    return 1
  fi
  printf '  %-12s ' "$remote"
  git push "$remote" "$BRANCH" 2>&1 | tail -1
}

echo "pushing $BRANCH"
ok=0
push_as "$HOME_ACCOUNT" origin && ok=$((ok + 1))
push_as lokigod69 lokigod69 && ok=$((ok + 1))

echo
if [ "$ok" -eq 2 ]; then
  echo "both remotes up to date. Vercel deploys from lokigod69."
else
  echo "$ok of 2 pushed — see above." >&2
  exit 1
fi
