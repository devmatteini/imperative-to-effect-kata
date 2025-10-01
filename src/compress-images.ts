import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs"
import * as path from "node:path"
import sharp from "sharp"
import { imageTypesRegex } from "./images.js"
import * as Effect from "effect/Effect"
import { FileSystem } from "@effect/platform"

const WIDTH_THRESHOLD = 1500

export const compressImages = (sourceDir: string, outputDir: string) =>
    Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem
        const sourceDirExists = yield* fs.exists(sourceDir)
        if (!sourceDirExists) {
            console.error(`\nSource directory ${sourceDir} does not exist\n`)
            return yield* Effect.dieMessage("Source directory does not exist")
        }

        yield* Effect.promise(() => compressImagesInner(sourceDir, outputDir))
    })

const compressImagesInner = async (sourceDir: string, outputDir: string) => {
    console.log(`\nReading images from ${sourceDir}\n`)

    const outputDirAbsolute = path.join(sourceDir, outputDir)
    rmSync(outputDirAbsolute, { recursive: true, force: true })
    mkdirSync(outputDirAbsolute, { recursive: true })

    const tasks = readdirSync(sourceDir)
        // keep-line
        .filter((file) => imageTypesRegex.test(file))
        .map((file) => processOne(path.join(sourceDir, file), outputDirAbsolute))
    const results = await Promise.all(tasks)

    console.log(`\nProcessed ${results.length} images \n`)
    console.log(`\nDONE\n`)
}

const processOne = async (inputFile: string, outputDir: string) => {
    const fileName = path.basename(inputFile)
    const outputFile = path.join(outputDir, `${fileName}.webp`)

    const metadata = await sharp(inputFile).metadata()
    const stat = statSync(inputFile)
    const sizeInKb = stat.size / 1024

    if (sizeInKb < 50 || !metadata.width || metadata.width < WIDTH_THRESHOLD) {
        copyFileSync(inputFile, outputFile)
        return { name: outputFile }
    } else {
        const info = await sharp(inputFile)
            .resize({ width: WIDTH_THRESHOLD, withoutEnlargement: true })
            .withMetadata()
            .webp({ lossless: false, quality: 80 })
            .toFile(outputFile)
        return { name: outputFile, ...info }
    }
}
