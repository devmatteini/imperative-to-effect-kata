import { resizeImages } from "./resize-images.js"
import { Console, Effect, Layer, Match, pipe } from "effect"
import { NodeFileSystem } from "@effect/platform-node"
import { SourceDirNotExists } from "./compress-images.js"
import { PlatformError } from "@effect/platform/Error"
import { ImageSharpLive } from "./image-sharp.js"

const MainLive = Layer.mergeAll(NodeFileSystem.layer, ImageSharpLive)

const logErrors = (error: SourceDirNotExists | PlatformError) =>
    pipe(
        Match.value(error),
        Match.tag("SourceDirNotExists", ({ path }) =>
            Console.error(`\nSource directory ${path} does not exist\n`),
        ),
        Match.tag("BadArgument", (error) => Console.error(error.message)),
        Match.tag("SystemError", (error) => Console.error(error.message)),
        Match.exhaustive,
    )

const program = pipe(
    resizeImages,
    Effect.tapError((error) => logErrors(error)),
    Effect.provide(MainLive),
)

Effect.runPromise(program)
    .then(() => process.exit(0))
    .catch(() => {
        process.exit(1)
    })
