import { resizeImages } from "./resize-images.ts"

resizeImages()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
