# Effect quickstart

Effect is a TypeScript library that enables to safely build complex and composable applications.

> The missing standard library for TypeScript (https://effect.website/)

## Features

- Concurrency
- Composability
- Resource Safety
- Type Safety
- Error Handling
- Observability

## Essentials

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

## Generators

You can write more readable code
using [JavaScript generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).

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

## Pipelines

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
