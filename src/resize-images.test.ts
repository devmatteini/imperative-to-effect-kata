import { expect, test } from "vitest"
import { readFile } from "node:fs/promises"
import { resizeImages } from "./resize-images.js"
import { Effect, pipe } from "effect"
import { NodeFileSystem } from "@effect/platform-node"

const MainLive = NodeFileSystem.layer

test("end to end", { timeout: 2_000 }, async () => {
    const program = pipe(resizeImages, Effect.provide(MainLive))
    await Effect.runPromise(program)

    const result = await readFile("./src/public/team-photos/processed/images.json")

    expect(result).toMatchSnapshot()
})
