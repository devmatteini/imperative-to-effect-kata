import { mkdirSync, readdirSync, writeFileSync } from "node:fs"
import * as path from "node:path"
import sharp from "sharp"
import { imageTypesRegex } from "./images.js"
import * as Effect from "effect/Effect"

export const reportProcessedImages = (
    sourceDir: string,
    outputFile: string,
    finalImageSrcBaseUrl: string,
) =>
    Effect.gen(function* () {
        console.log(`\nReading images from ${sourceDir}\n`)

        const outputFileAbsolute = path.join(sourceDir, outputFile)

        yield* Effect.promise(() =>
            reportProcessedImagesInner(sourceDir, outputFileAbsolute, finalImageSrcBaseUrl),
        )
    })

const reportProcessedImagesInner = async (
    sourceDir: string,
    outputFileAbsolute: string,
    finalImageSrcBaseUrl: string,
) => {
    const tasks = readdirSync(sourceDir)
        // keep-line
        .filter((file) => imageTypesRegex.test(file))
        .map((file) => processOne(path.join(sourceDir, file), finalImageSrcBaseUrl))
    const results = await Promise.all(tasks)

    console.log(`\nWriting results to ${outputFileAbsolute}\n`)

    writeOutputFile(outputFileAbsolute, results)

    console.log(`\nDONE\n`)
}

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
