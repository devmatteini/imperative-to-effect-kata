import { mkdirSync, writeFileSync } from "node:fs"
import * as path from "node:path"
import sharp from "sharp"
import { imageTypesRegex } from "./images.js"
import * as Effect from "effect/Effect"
import { FileSystem } from "@effect/platform"
import { pipe } from "effect"
import * as Array from "effect/Array"

export const reportProcessedImages = (
    sourceDir: string,
    outputFile: string,
    finalImageSrcBaseUrl: string,
) =>
    Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem
        console.log(`\nReading images from ${sourceDir}\n`)

        const outputFileAbsolute = path.join(sourceDir, outputFile)

        const sourceFiles = yield* fs.readDirectory(sourceDir)
        const results = yield* pipe(
            sourceFiles,
            Array.filter((file) => imageTypesRegex.test(file)),
            Effect.forEach(
                (file) =>
                    Effect.promise(() =>
                        processOne(path.join(sourceDir, file), finalImageSrcBaseUrl),
                    ),
                { concurrency: 5 },
            ),
        )

        console.log(`\nWriting results to ${outputFileAbsolute}\n`)

        writeOutputFile(outputFileAbsolute, results)

        console.log(`\nDONE\n`)
    })

const processOne = async (file: string, finalImageSrcBaseUrl: string) => {
    const metadata = await sharp(file).metadata()
    const fileName = path.basename(file)
    return {
        src: `${finalImageSrcBaseUrl}/${fileName}`,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        orientation: metadata.orientation,
    }
}

const writeOutputFile = (outputFile: string, content: unknown[]) => {
    const outputFileDir = path.dirname(outputFile)
    mkdirSync(outputFileDir, { recursive: true })
    writeFileSync(outputFile, JSON.stringify(content, null, 2), {})
}
