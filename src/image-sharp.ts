import { Effect, Layer } from "effect"
import { Image } from "./compress-images.js"
import sharp from "sharp"

export const ImageSharpLive = Layer.succeed(Image, {
    metadata: (inputFile) => Effect.promise(() => sharp(inputFile).metadata()),
    optimize: (inputFile, outputFile, maxWidth) =>
        Effect.promise(() =>
            sharp(inputFile)
                .resize({ width: maxWidth, withoutEnlargement: true })
                .withMetadata()
                .webp({ lossless: false, quality: 80 })
                .toFile(outputFile),
        ),
})
