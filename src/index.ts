import * as Effect from "effect/Effect"
import { resizeImages } from "./resize-images.js"

const program = Effect.promise(() => resizeImages())

Effect.runPromise(program)
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
