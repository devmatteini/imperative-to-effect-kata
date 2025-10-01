import * as Layer from "effect/Layer"
import { Image } from "./image.js"
import { Effect } from "effect"
import sharp from "sharp"

export const ImageSharpLive = Layer.succeed(Image, {
    metadata: (path) => Effect.promise(() => sharp(path).metadata()),
    resize: (inputFile, outputFile, width) =>
        Effect.promise(() =>
            sharp(inputFile)
                .resize({ width, withoutEnlargement: true })
                .withMetadata()
                .webp({ lossless: false, quality: 80 })
                .toFile(outputFile),
        ),
})
