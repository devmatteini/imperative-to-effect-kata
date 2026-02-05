import { resizeImages } from "./resize-images.js"
import { Console, Effect, Match, pipe } from "effect"
import { NodeFileSystem } from "@effect/platform-node"

const MainLive = NodeFileSystem.layer

const program = pipe(
    resizeImages,
    Effect.tapError((error) =>
        pipe(
            Match.value(error),
            Match.tag("SourceDirNotExistsError", ({ path }) =>
                Console.error(`Source directory ${path} does not exist`),
            ),
            Match.tag("SystemError", (e) => Console.error(`System error ${e.message}`)),
            Match.tag("BadArgument", (e) => Console.error(`Bad argument error ${e.message}`)),
            Match.exhaustive,
        ),
    ),
    Effect.provide(MainLive),
)

Effect.runPromise(program)
    .then(() => process.exit(0))
    .catch(() => {
        process.exit(1)
    })
