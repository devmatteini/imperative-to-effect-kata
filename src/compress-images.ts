import * as path from "node:path"
import { imageTypesRegex } from "./images.js"
import { Array, Context, Data, Effect, pipe } from "effect"
import { FileSystem } from "@effect/platform"

const WIDTH_THRESHOLD = 1500

export class SourceDirNotExists extends Data.TaggedError("SourceDirNotExists")<{
    path: string
}> {}

export const compressImages = (sourceDir: string, outputDir: string) =>
    Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem

        const sourceDirExists = yield* fs.exists(sourceDir)
        if (!sourceDirExists) {
            return yield* new SourceDirNotExists({ path: sourceDir })
        }

        console.log(`\nReading images from ${sourceDir}\n`)

        const outputDirAbsolute = path.join(sourceDir, outputDir)
        yield* fs.remove(outputDirAbsolute, { recursive: true, force: true })
        yield* fs.makeDirectory(outputDirAbsolute, { recursive: true })

        const files = yield* fs.readDirectory(sourceDir)
        const tasks = pipe(
            files,
            Array.filter((file) => imageTypesRegex.test(file)),
            Array.map((file) => processOne(path.join(sourceDir, file), outputDirAbsolute)),
        )
        const results = yield* Effect.all(tasks, { concurrency: 4 })

        console.log(`\nProcessed ${results.length} images \n`)
        console.log(`\nDONE\n`)
    })

type ImageService = {
    metadata: (filePath: string) => Effect.Effect<{ width: number }>
    optimize: (filePath: string, outputFilePath: string, maxWidth: number) => Effect.Effect<void>
}
export class Image extends Context.Tag("Image")<Image, ImageService>() {}

const processOne = (inputFile: string, outputDir: string) =>
    Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem
        const image = yield* Image

        const fileName = path.basename(inputFile)
        const outputFile = path.join(outputDir, `${fileName}.webp`)

        const metadata = yield* image.metadata(inputFile)
        const stat = yield* fs.stat(inputFile)
        const sizeInKb = Number(stat.size) / 1024

        if (sizeInKb < 50 || !metadata.width || metadata.width < WIDTH_THRESHOLD) {
            yield* fs.copyFile(inputFile, outputFile)
            return { name: outputFile }
        } else {
            yield* image.optimize(inputFile, outputFile, WIDTH_THRESHOLD)
            return { name: outputFile }
        }
    })
