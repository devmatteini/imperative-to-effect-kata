import { test, expect } from "vitest"
import { readFile } from "node:fs/promises"
import { resizeImages } from "./resize-images.js"
import * as Effect from "effect/Effect"
import { NodeFileSystem } from "@effect/platform-node"

test("end to end", { timeout: 2_000 }, async () => {
    const program = resizeImages.pipe(Effect.provide(NodeFileSystem.layer))
    await Effect.runPromise(program)

    const result = await readFile("./src/public/team-photos/processed/images.json")

    expect(result).toMatchSnapshot()
})
