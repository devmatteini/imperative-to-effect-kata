import { compressImages } from "./compress-images.js"
import { reportProcessedImages } from "./report-processed-images.js"
import * as path from "node:path"

const sourceDirRelative = "./public/team-photos"
const sourceDirAbsolute = new URL(sourceDirRelative, import.meta.url).pathname
const compressOutputDir = "processed"

const processedDirAbsolute = path.join(sourceDirAbsolute, compressOutputDir)
const finalImageSrcBaseUrl = `/team-photos/${compressOutputDir}`
const jsonOutputFile = "images.json"

export const resizeImages = async () => {
    await compressImages(sourceDirAbsolute, compressOutputDir)
    await reportProcessedImages(processedDirAbsolute, jsonOutputFile, finalImageSrcBaseUrl)
}
