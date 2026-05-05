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

Build with watch mode:

```bash
pnpm dev
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
  cli/          - CLI, Express backend, and Vite frontend app
  parser/       - YAML frontmatter document parser
  themes/       - Vue theme components
  types/        - Type definitions and Zod schemas
  create-draft/ - Script for `pnpm create draft`
demo/           - Demo document for local development
```

## Tests

```bash
pnpm test
```

## Release

```bash
pnpm release
```
