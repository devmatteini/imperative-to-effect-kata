# Effect quickstart

Effect is a TypeScript library that enables to **safely** build complex and **composable** applications.

> The missing standard library for TypeScript (https://effect.website/)

Effect takes a **pragmatic** approach to functional programming. Rather than being purely academic, it brings core FP
principles to TypeScript in a way that's **accessible** and **production-ready**.

## Key Features

- Type Safety everywhere
- Automatic error tracking
- Error Handling
- Automatic dependency tracking
- Dependency injection
- Composability
- Concurrency
- Resource Safety
- Asynchronicity
- Observability

## Essentials

The Effect type `Effect<Success, Error, Requirements>` is the core type of the whole library.

You can think of an Effect as a function that takes a context with the required dependencies and returns either an error
or a success value.

```ts
type Effect<Success, Error, Requirements> = (context: Context<Requirements>) => Error | Success
```

In reality Effects are not just simple functions, but they are **immutable** values that describe a workflow or
operation that is **lazily** executed.

In order to execute an Effect, you need the **Effect runtime**:

```ts
import { Effect } from "effect"

const divide = (a: number, b: number): Effect.Effect<number, Error> =>
  b === 0
    ? Effect.fail(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b)

console.log(Effect.runSync(divide(4, 2))) // 2
console.log(Effect.runSync(divide(4, 0))) // Error: Cannot divide by zero
```

## A typical Effect program

```ts
import { Array, Effect, pipe } from "effect"

declare const loadTodos: Effect.Effect<Todo[]>

const program = Effect.gen(function* () {
  const allTodos = yield* loadTodos
  const todos = pipe(
    allTodos,
    Array.filter((x) => x.status !== "completed"),
    Array.take(10),
  )
  console.log(todos)
})

Effect.runSync(program)
```

### Generators

You can write more readable code
using [JavaScript generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).

Think of `function*/yield*` as `async/await`.

### Pipelines

Pipelines compose multiple functions together in a clear and concise way. They are especially useful when working with
arrays or collections of data.

You can also use them with Effects instead of generators if you prefer that style.
