import * as path from "node:path"
import { imageTypesRegex } from "./images.js"
import * as Effect from "effect/Effect"
import { FileSystem } from "@effect/platform"
import * as Array from "effect/Array"
import { pipe } from "effect"
import { Image } from "./image.js"

const WIDTH_THRESHOLD = 1500

export const compressImages = (sourceDir: string, outputDir: string) =>
    Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem
        const sourceDirExists = yield* fs.exists(sourceDir)
        if (!sourceDirExists) {
            console.error(`\nSource directory ${sourceDir} does not exist\n`)
            return yield* Effect.dieMessage("Source directory does not exist")
        }

        console.log(`\nReading images from ${sourceDir}\n`)

        const outputDirAbsolute = path.join(sourceDir, outputDir)
        yield* fs.remove(outputDirAbsolute, { recursive: true, force: true })
        yield* fs.makeDirectory(outputDirAbsolute, { recursive: true })

        const sourceFiles = yield* fs.readDirectory(sourceDir)
        const results = yield* pipe(
            sourceFiles,
            Array.filter((file) => imageTypesRegex.test(file)),
            Effect.forEach((file) => processOne(path.join(sourceDir, file), outputDirAbsolute), {
                concurrency: 5,
            }),
        )

        console.log(`\nProcessed ${results.length} images \n`)
        console.log(`\nDONE\n`)
    })

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
            const info = yield* image.resize(inputFile, outputFile, WIDTH_THRESHOLD)
            return { name: outputFile, ...info }
        }
    })
