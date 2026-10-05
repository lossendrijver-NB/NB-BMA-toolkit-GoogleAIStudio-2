<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## NOBEARS architecture

- Keep the source content dataset unchanged; asset pointers may be rehomed independently to preserve content while making media resolve in this project.
- Use the existing TanStack file routes and content repositories; no database, authentication, CMS or live provider is required for this read-only V1.
- Derive reverse relations from ambition.serviceIds and case.serviceIds so one canonical relation remains authoritative.
- Future Notion additions must pass a pure, non-mutating import-preview adapter; existing IDs and slugs are never overwritten and no sync runs on page load.
- Keep search ranking separate from presentation, and use the same search experience on home and detail pages for consistent discovery.
