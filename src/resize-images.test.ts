import { test, expect } from "vitest"
import { readFile } from "node:fs/promises"
import { resizeImages } from "./resize-images.js"
import { Effect, Layer, pipe } from "effect"
import { NodeFileSystem } from "@effect/platform-node"
import { ImageSharpLive } from "./image-sharp.js"

test("end to end", { timeout: 2_000 }, async () => {
    const MainLive = Layer.mergeAll(NodeFileSystem.layer, ImageSharpLive)
    const program = pipe(resizeImages, Effect.provide(MainLive))

    await Effect.runPromise(program)

    const result = await readFile("./src/public/team-photos/processed/images.json")

    expect(result).toMatchSnapshot()
})
