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

### Effect quickstart

Effect is a TypeScript library that enables to safely build complex and composable applications.

> The missing standard library for TypeScript (https://effect.website/)

#### Features

- Concurrency
- Composability
- Resource Safety
- Type Safety
- Error Handling
- Observability

#### Essentials

The Effect type `Effect<Success, Error, Requirements>` is the core type of the whole library.

```ts
type Effect<Success, Error, Requirements> = (context: Context<Requirements>) => Error | Success
```

Effects are **immutable** values that **lazily** describe a workflow or operation.

In order to execute an Effect, you need the Effect runtime:

```ts
const program = Effect.sync(() => {
  console.log("Hello world!")
})

Effect.runSync(program)
// output: Hello world!
```

### Generators

You can write more readable code using [JavaScript generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).

Think of `function*/yield*` as `async/await`.

```ts
declare const loadTodos: Effect<Todo[]>

const program = Effect.gen(function* () {
  const allTodos = yield* loadTodos
  const todos = allTodos.filter((x) => x.status !== "completed")
  console.log(todos)
})

Effect.runSync(program)
```

### Pipelines

Alternatively to generators you can use pipelines

```ts
declare const loadTodos: Effect<Todo[]>

const program = pipe(
  loadTodos,
  Effect.map((allTodos) => allTodos.filter((x) => x.status !== "completed")),
  Effect.tap((todos) => Effect.sync(() => console.log(todos)))
)

Effect.runSync(program)
```

## Suggestions

A list of improvements you can do after converting the codebase to Effect:

- Explicit [error management](https://effect.website/docs/error-management/two-error-types/) (domain errors + unexpected
  errors)
- Use [dependency injection](https://effect.website/docs/requirements-management/services/) to avoid direct access to
  image processing library (sharp)
- Create a CLI with options to change the default application configuration (source/output directories, reporting, etc)

## Solution

Check out the [solution branch](https://github.com/devmatteini/imperative-to-effect-kata/tree/solution).
