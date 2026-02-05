import { copyFileSync, readdirSync, statSync } from "node:fs"
import * as path from "node:path"
import sharp from "sharp"
import { imageTypesRegex } from "./images.js"
import { Data, Effect, pipe, Array } from "effect"
import { FileSystem } from "@effect/platform"

const WIDTH_THRESHOLD = 1500

export class SourceDirNotExistsError extends Data.TaggedError("SourceDirNotExistsError")<{
    path: string
}> {}

export const compressImages = (sourceDir: string, outputDir: string) =>
    Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem

        const sourceDirExists = yield* fs.exists(sourceDir)
        if (!sourceDirExists) {
            return yield* new SourceDirNotExistsError({ path: sourceDir })
        }

        console.log(`\nReading images from ${sourceDir}\n`)

        const outputDirAbsolute = path.join(sourceDir, outputDir)
        yield* fs.remove(outputDirAbsolute, { recursive: true, force: true })
        yield* fs.makeDirectory(outputDirAbsolute, { recursive: true })

        console.log(`\nReading images from ${sourceDir}\n`)

        const files = yield* fs.readDirectory(sourceDir)
        const tasks = pipe(
            files,
            Array.filter((file) => imageTypesRegex.test(file)),
            Array.map((file) => processOne(path.join(sourceDir, file), outputDirAbsolute)),
        )
        const results = yield* Effect.all(tasks, { concurrency: 5 })

        console.log(`\nProcessed ${results.length} images \n`)
        console.log(`\nDONE\n`)
    })

const processOne = (inputFile: string, outputDir: string) =>
    Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem

        const fileName = path.basename(inputFile)
        const outputFile = path.join(outputDir, `${fileName}.webp`)

        const metadata = yield* Effect.promise(() => sharp(inputFile).metadata())
        const stat = yield* fs.stat(inputFile)
        const sizeInKb = Number(stat.size) / 1024

        if (sizeInKb < 50 || !metadata.width || metadata.width < WIDTH_THRESHOLD) {
            yield* fs.copyFile(inputFile, outputFile)
            return { name: outputFile }
        }

        const info = yield* Effect.promise(() =>
            sharp(inputFile)
                .resize({ width: WIDTH_THRESHOLD, withoutEnlargement: true })
                .withMetadata()
                .webp({ lossless: false, quality: 80 })
                .toFile(outputFile),
        )
        return { name: outputFile, ...info }
    })
