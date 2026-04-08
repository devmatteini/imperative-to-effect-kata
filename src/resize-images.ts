import { compressImages } from "./compress-images.ts"
import { reportProcessedImages } from "./report-processed-images.ts"
import * as path from "node:path"

const sourceDirRelative = "./public/team-photos"
const sourceDirAbsolute = path.join(import.meta.dirname, sourceDirRelative)
const compressOutputDir = "processed"

const processedDirAbsolute = path.join(sourceDirAbsolute, compressOutputDir)
const finalImageSrcBaseUrl = `/team-photos/${compressOutputDir}`
const jsonOutputFile = "images.json"

export const resizeImages = async () => {
    await compressImages(sourceDirAbsolute, compressOutputDir)
    await reportProcessedImages(processedDirAbsolute, jsonOutputFile, finalImageSrcBaseUrl)
}
