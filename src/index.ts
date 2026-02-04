import { resizeImages } from "./resize-images.js"
import { Effect } from "effect"

const program = Effect.promise(() => resizeImages())

Effect.runPromise(program)
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
