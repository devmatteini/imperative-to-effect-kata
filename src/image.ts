import * as Context from "effect/Context"
import { Effect } from "effect"

export type ImageMetadata = {
    width: number
    height: number
    format: string
    orientation?: number | undefined
}

type ImageService = {
    metadata: (path: string) => Effect.Effect<ImageMetadata>
    resize: (inputFile: string, outputFile: string, width: number) => Effect.Effect<ImageMetadata>
}

export class Image extends Context.Tag("Image")<Image, ImageService>() {}
