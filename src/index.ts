import { resizeImages } from "./resize-images.js"
import { Effect, pipe } from "effect"
import { NodeFileSystem } from "@effect/platform-node"

const MainLive = NodeFileSystem.layer

const program = pipe(resizeImages, Effect.provide(MainLive))

Effect.runPromise(program)
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
