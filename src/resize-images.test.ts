import { test, expect } from "vitest"
import { readFile } from "node:fs/promises"
import { resizeImages } from "./resize-images.js"
import * as Effect from "effect/Effect"
import { NodeFileSystem } from "@effect/platform-node"
import * as Layer from "effect/Layer"
import { ImageSharpLive } from "./image-sharp.js"

const MainLive = Layer.mergeAll(NodeFileSystem.layer, ImageSharpLive)

test("end to end", { timeout: 2_000 }, async () => {
    const program = resizeImages.pipe(Effect.provide(MainLive))
    await Effect.runPromise(program)

    const result = await readFile("./src/public/team-photos/processed/images.json")

    expect(result).toMatchSnapshot()
})
