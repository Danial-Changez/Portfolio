# Portfolio

Source of [dchangez.com](https://dchangez.com), Danial Changez's one-page portfolio: intro,
experience, projects and skills, with email, GitHub and LinkedIn links in the footer.

## Stack

- [Vite](https://vite.dev) and TypeScript in strict mode, no framework
- [Tailwind CSS v4](https://tailwindcss.com) through `@tailwindcss/vite`, plus hand-written CSS
- Prettier, ESLint, Stylelint and html-validate
- Node's built-in test runner

Nothing ships as a runtime dependency; every package in `package.json` is build tooling.

## Layout

- `index.html`: the page markup
- `src/main.ts`: the theme toggle and the email links, which assemble the address at runtime so it
  never appears whole in the page source
- `src/style.css`: Tailwind import, the light and dark colour tokens, and a `dark` variant that
  follows the system theme unless the toggle overrides it
- `public/`: files served as they are (`favicon.png`, `projects/`, `404.html`). Project images
  that need a version per theme come as `-light` and `-dark` files.
- `diagrams/`: PlantUML sources for diagram images in `public/projects/`, with the service logos
  they use in `diagrams/icons/` (Simple Icons, CC0)
- `test/`: checks that local links in `index.html` resolve (CI also greps the build for a plain
  email address)

File and class names are kebab-case.

## Development

Requires Node 24 (see `.nvmrc`).

```sh
npm ci
npm run dev      # dev server with hot reload
npm run build    # type-check, then build to dist/
npm run preview  # serve the production build locally
```

After editing a diagram, render it with PlantUML 1.2026.6 and Graphviz:

```sh
java -jar plantuml-1.2026.6.jar -tsvg -o "$PWD/public/projects" diagrams/*.puml
```

Checks, all of which CI runs on every pull request:

```sh
npm run format:check  # Prettier; `npm run format` rewrites the files
npm run lint          # ESLint
npm run lint:css      # Stylelint
npm run lint:html     # html-validate
npm test
```

## Deployment

Pushing to `main` runs `.github/workflows/ci.yml`, which publishes `dist/` to GitHub Pages once
every check passes. `dist/` is not committed. The custom domain is set in the repository's Pages
settings, so there is no `CNAME` file. Pages serves `404.html` for unknown paths, such as the old
`/resume.pdf`, and it redirects to the homepage.
