# ilpal.github.io

Website of **ILPAL**, the Initiative for Legacy Preservation, Adaptation and Longevity.
It's a static, bilingual (English / Tiếng Việt) site built with [Jekyll](https://jekyllrb.com/),
Dart Sass and TypeScript.

## Develop

Requires Ruby 3.1+ with Bundler, and Node.js 20+.

```bash
bundle install
npm ci
```

Run these in two terminals:

```bash
npm run watch
```

```bash
bundle exec jekyll serve --livereload
```

Open <http://localhost:4000>. Before committing, run `npm run typecheck`.
Build output (`_site/`, `assets/js/`) isn't committed.

## Deploy

`.github/workflows/pages.yml` compiles the TypeScript, builds the site, checks every
pull request and deploys every push to `main`.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Don't use "Deploy from a branch": that mode ignores the workflow and uses GitHub's
legacy builder, which can't compile the stylesheets or the TypeScript, so the site
ships unstyled.

## Structure

```
_config.yml              Build settings, locales, brand asset paths
_data/
  i18n/<lang>.yml        All UI copy, one file per locale (identical keys)
  locales.yml            Locale metadata: label, html lang, URL prefix
  navigation.yml         Primary navigation
  organization.yml       Links and facts shared by all locales (contact, donation platforms…)
  projects.yml           Project catalog (the first entry is featured on the home page)
  taxonomy.yml           Project kinds and statuses
_layouts/                One template per page type (home, projects, project, support, about)
_includes/
  core/                  Rendering context, <head>, translation helpers
  components/            Reusable UI: header, footer, hero band, project card, filters…
  icons/                 Inline SVG icons
_sass/
  abstracts/             Variables and mixins (no CSS output)
  base/                  Design tokens (CSS custom properties), reset, typography
  layout/                Container, hero band, grids
  components/            One partial per component (BEM class names)
src/scripts/
  main.ts                Script entry point; runs modules/ on elements that opt in via data-*
  modules/               One file per behaviour (menu toggle, project filter)
assets/
  css/main.scss          Sass entry point
  js/                    Compiled from src/scripts (generated, not committed)
  img/                   Decorative artwork
  icon/                  Raster logo exports (see below)
index.html, projects/, support/, about/     English pages (front matter only)
vi/…                                         Vietnamese pages (front matter only)
```

Page files contain only front matter. `ref` links translations of the same page,
`page_key` selects its strings in `_data/i18n`, and `nav` marks the current menu item.

## Common tasks

### Edit copy
Change the string in `_data/i18n/en.yml` **and** `_data/i18n/vi.yml`. Keys ending in `_html`
may contain inline HTML and the tokens `%github%`, `%about%` and `%count%`.

### Fill in a placeholder
Values such as `[CONTACT]` and `[ADD LINK]` render while the matching field is empty.
Set it in `_data/organization.yml` (contact, funding reports, donation platform URLs) or
`_data/projects.yml` (source, docs, release date, screenshot).

### Add a project
1. Add an entry to `_data/projects.yml`, using ids from `_data/taxonomy.yml`.
2. Copy `projects/opentaan/index.html` and `vi/projects/opentaan/index.html`, then change
   `ref`, `permalink` and `project`.

Kind/status filters appear automatically once there are at least
`projects_filter_threshold` projects (default 5).

### Add a language
1. Add the code to `languages` in `_config.yml` and its entry in `_data/locales.yml`.
2. Copy `_data/i18n/en.yml` to `_data/i18n/<code>.yml`, translate it, and add the
   `i18n.<code>` block to each project.
3. Copy the `vi/` folder to `<code>/`, change the permalinks, and add a front-matter default in `_config.yml`.

## Brand assets

The logo is published **only as raster exports** in `assets/icon/`. The vector source is
intentionally kept out of this repository (`.gitignore` blocks `assets/icon/*.svg`).

| File | Used for |
|---|---|
| `ilpal-project-icon-256-transparent.png` | Header and footer logo, home-page hero |
| `ilpal-nav-icon-32.png` | Browser tab icon (favicon) |
| `ilpal-project-icon-256.png` | Link previews (`og:image`) and Apple touch icon |

Paths are configured under `brand` in `_config.yml`.
