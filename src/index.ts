import * as Effect from "effect/Effect"
import { resizeImages } from "./resize-images.js"
import { pipe } from "effect"
import { NodeFileSystem } from "@effect/platform-node"
import * as Layer from "effect/Layer"
import { ImageSharpLive } from "./image-sharp.js"

const MainLive = Layer.mergeAll(NodeFileSystem.layer, ImageSharpLive)

const program = pipe(resizeImages, Effect.provide(MainLive))

Effect.runPromise(program)
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
