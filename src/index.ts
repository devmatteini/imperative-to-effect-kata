import * as Effect from "effect/Effect"
import { resizeImages } from "./resize-images.js"
import { pipe } from "effect"
import { NodeFileSystem } from "@effect/platform-node"

const program = pipe(resizeImages, Effect.provide(NodeFileSystem.layer))

Effect.runPromise(program)
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
