# Development

## Setup

This project uses [pnpm](https://pnpm.io/) to manage dependencies.

```bash
nvm use
pnpm install
```

## Development

Build all packages at once:

```bash
pnpm build
```

### Run Demo

To run the demo document locally:

```bash
pnpm demo:dev
```

The server will restart automatically every time the builds get updated.

## Project Structure

```
packages/
  cli/          - CLI and Vite-based dev server / export pipeline
  components/   - Semantic Vue components for authoring documents
  themes/       - Vue theme templates
  types/        - Type definitions and Zod schemas
  create-draft/ - Script for `pnpm create draft`
  parser/       - Deprecated (documents are now Vue SFCs)
demo/           - Demo document (document.vue) for local development
```

## Tests

```bash
pnpm test
```

## Release

```bash
pnpm release
```
