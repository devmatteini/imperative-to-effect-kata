# Imperative to Effect Kata

Refactoring kata to practice the conversion of an imperative codebase to a functional one,
using [Effect](https://effect.website/) TypeScript library.

This is modified version of the original kata created by Massimo
Iacolare [imperative-to-fp-kata](https://github.com/iacoware/imperative-to-fp-kata/).

[Your Task](#your-task) • [Getting Started](#getting-started) • [Suggestions](#suggestions)

## Your Task

The application resize and compress all the images found in `src/public/team-photos` and write them into
`public/team-photos/processed`. It also generate a json file (`images.json`) with the list of the processed images
within the
same directory that contains each image metadata.

You should refactor the codebase to transition from an imperative to a functional one using Effect library.
While doing so, ensure that the application remains fully functional after each change.

## Getting Started

Install node 22+ and `pnpm` package manager.

Install dependencies:

```shell
pnpm install
```

Run the application:

```shell
pnpm start
```

Run typechecker:

```shell
pnpm run typecheck
# watch mode
pnpm run typecheck:w
```

Run tests:

```shell
pnpm run test
# watch mode
pnpm run test:w
```

After you checked all previous commands works, you can open [src/index.ts](./src/index.ts) and start refactoring!

## Suggestions

A list of improvements you can do after converting the codebase to Effect:

- Explicit [error management](https://effect.website/docs/error-management/two-error-types/) (domain errors + unexpected
  errors)
- Use [dependency injection](https://effect.website/docs/requirements-management/services/) to avoid direct access to
  image processing library (sharp)
- Create a CLI with options to change the default application configuration (source/output directories, reporting, etc)

## Solution

Check out the [solution branch](https://github.com/devmatteini/imperative-to-effect-kata/tree/solution).
