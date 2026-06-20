# Dungeon Keepers — Claude Code Instructions

## Standing Orders

### Changelog (mandatory on every version bump)
Whenever `version.js` is bumped to a new version number, **always** add a new entry at the **top** of the Changelog section in `wiki.html` (inside `#wiki-changelog`). The entry must:
- Use the `.biome-card` div pattern already in use
- Include `<span class="cl-ver">vX.XX</span>` and `<span class="cl-date">YYYY-MM-DD</span>`
- Summarize the changes in 1–3 sentences (what was added, fixed, or changed)
- Be placed **above** all existing entries (newest first)

Entry format:
```html
<div class="biome-card">
    <div><span class="cl-ver">v0.XX</span><span class="cl-date">YYYY-MM-DD</span></div>
    <p class="biome-desc">Summary of what changed in this version.</p>
</div>
```

Also update the Research section of `wiki.html` (`wiki-gameplay` → Research paragraph) if research systems change significantly.

### Version bumping
Version lives in `version.js` as `window.GAME_VERSION`. Bump it on any session that ships visible player-facing changes. Minor bug fixes within a session can share a version. The bump goes in `version.js` only — asset cache-busting is automatic.
