import * as path from "node:path"
import { imageTypesRegex } from "./images.js"
import * as Effect from "effect/Effect"
import { FileSystem } from "@effect/platform"
import { pipe } from "effect"
import * as Array from "effect/Array"
import { Image, ImageMetadata } from "./image.js"

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
            Effect.forEach((file) => processOne(path.join(sourceDir, file), finalImageSrcBaseUrl), {
                concurrency: 5,
            }),
        )

        console.log(`\nWriting results to ${outputFileAbsolute}\n`)

        yield* writeOutputFile(outputFileAbsolute, results)

        console.log(`\nDONE\n`)
    })

const processOne = (file: string, finalImageSrcBaseUrl: string) =>
    Effect.gen(function* () {
        const image = yield* Image
        const metadata = yield* image.metadata(file)
        const fileName = path.basename(file)
        return {
            src: `${finalImageSrcBaseUrl}/${fileName}`,
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            orientation: metadata.orientation,
        }
    })

const writeOutputFile = (outputFile: string, content: ImageMetadata[]) =>
    Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem

        const outputFileDir = path.dirname(outputFile)

        yield* fs.makeDirectory(outputFileDir, { recursive: true })
        yield* fs.writeFileString(outputFile, JSON.stringify(content, null, 2), {})
    })
