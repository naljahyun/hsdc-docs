# Agent Memory

This repository is the patient-facing information site for 효사랑치과병원.
Use this file as the first project-specific memory for Codex, Claude, and other agents.

## Project Basics

- Static site generator: MkDocs 1.6.1 with Material for MkDocs 9.7.6.
- Production URL: `https://doc.hyosarang.org`.
- Repository: `hyosarang-dental/hsdc-docs`.
- Main branch deploys automatically through GitHub Actions Pages workflow.

## Common Workflow

1. Edit source files under `docs/`, `mkdocs.yml`, `.github/`, or root docs.
2. Run `.venv/bin/mkdocs build --strict`.
3. Commit focused changes.
4. Push `main`; GitHub Actions deploys to GitHub Pages.

Do not manually edit `site/`; it is generated output.

## Important Files

- `structure.md`: current file structure, stylesheet layers, fee-table contract, and deployment notes.
- `mkdocs.yml`: site config, navigation, theme, extensions, and asset registration.
- `.github/workflows/pages.yml`: GitHub Pages deployment workflow.
- `requirements.txt`: pinned MkDocs build dependencies.

## Content Pages

- `docs/index.md`: document-style home hub.
- `docs/certificates.md`: dental insurance document issuing guide.
- `docs/certificate-fees.md`: certificate issuing fees from CSV.
- `docs/non-covered-fees.md`: non-covered fee table from CSV.

## Stylesheet Layers

Keep CSS split by responsibility:

- `docs/stylesheets/tokens.css`: fonts, design tokens, Material variables.
- `docs/stylesheets/base.css`: global typography, header, nav, search, footer, admonitions.
- `docs/stylesheets/components.css`: reusable `eyebrow`, `doc-meta`, `quick-jump`.
- `docs/stylesheets/home.css`: home page only.
- `docs/stylesheets/fees.css`: fee tables and price column behavior.
- `docs/stylesheets/certificates.css`: certificates page only.
- `docs/stylesheets/extra.css`: legacy placeholder only.

Use page scopes for page-specific UI:

- `.page-home`
- `.page-certificates`
- `.page-fees`

## Fee Tables

Fee data lives in `docs/data/*.csv`.

- `*-Certificated.csv`: certificate fee tables.
- `*-Noninsured.csv`: non-covered fee tables.

For fee tables, wrap `read_csv()` in:

```markdown
<div class="fee-table" markdown>

{{ read_csv('Some-File.csv') }}

</div>
```

`docs/javascripts/fee-count.js`:

- Counts rows after each `h2.fee-section`.
- Adds `data-count`.
- Finds the `비용` column.
- Removes table-reader inline left alignment.
- Adds `.price`.
- Wraps numeric sequences in `.num`.

CSS should style price cells through `.price`, not column-position selectors.

## Non-Covered CSV Ordering

Current ordering intent for `*-Noninsured.csv`:

- Representative treatment first.
- Then commonly requested add-ons, material choices, or procedure complexity.
- Then repair, remaking, attachment, temporary, or maintenance items.

Do not reorder alphabetically by default. The table is patient-facing and should prioritize practical importance.

## Deployment Notes

GitHub Pages workflow:

- `main` push triggers `.github/workflows/pages.yml`.
- Workflow builds `site/` with `mkdocs build --strict`.
- Pages deployment uses GitHub Actions artifact deploy.

If `https://doc.hyosarang.org` returns 404:

- Check Actions run status first.
- Build can pass while deploy fails.
- Ensure GitHub Pages source is GitHub Actions.
- Ensure the custom-domain CNAME is present in the active DNS provider.

## Git Notes

- Keep commits focused.
- User prefers commit message footer:
  `Co-Authored-By: Claude Opus 4.7`
