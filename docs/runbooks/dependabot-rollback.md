# Rolling back a bad dependency update

Use when a `deploy-smoke-failure` issue opens, or production is broken after
an auto-merged Dependabot update.

1. **Identify the commit.** The issue body contains the SHA. Otherwise:

   ```bash
   git fetch origin
   git log origin/development --oneline -10
   ```

2. **Revert on `development` via PR.** This redeploys the previous
   dependency versions.

   ```bash
   git switch -c revert/<package>-<version> origin/development
   git revert <sha>        # squash commit (Dependabot auto-merges)
   git revert -m 1 <sha>   # merge commit (PRs merged with "Create a merge commit")
   git push -u origin HEAD
   gh pr create --draft --fill
   ```

   Use exactly one of the two `git revert` lines. The alert issue already picks
   the right one; if it could not look the commit up, check the parent count
   with `git rev-list --parents -n 1 <sha>` (two SHAs after `<sha>` means a
   merge commit).

   Mark ready and merge once the required checks pass.

   Do **not** reset `main` to an older deploy commit: that is a force-push, and
   the next deploy from `development` reintroduces the break.

3. **Stop Dependabot reproposing the version.** In the same PR, add to
   `.github/dependabot.yml` under the npm entry:

   ```yaml
   ignore:
     - dependency-name: "<package>"
       versions: ["<bad version>"]
   ```

4. **Close the issue** with a link to the revert PR. Remove the `ignore`
   entry once a fixed version is released.
