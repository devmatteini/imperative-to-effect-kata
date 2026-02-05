import { test, expect } from "vitest"
import { readFile } from "node:fs/promises"
import { resizeImages } from "./resize-images.js"
import { Effect } from "effect"

test("end to end", { timeout: 2_000 }, async () => {
    await Effect.runPromise(resizeImages)

    const result = await readFile("./src/public/team-photos/processed/images.json")

    expect(result).toMatchSnapshot()
})
