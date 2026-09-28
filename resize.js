import sharp from "sharp";
import path from "path";

const fileConfigs = [
  {
    fileName: "android-chrome-192x192.png",
    size: 192,
  },
  {
    fileName: "android-chrome-512x512.png",
    size: 512,
  },
  {
    fileName: "apple-touch-icon.png",
    size: 180,
  },
  {
    fileName: "favicon-16x16.png",
    size: 16,
  },
  {
    fileName: "favicon-32x32.png",
    size: 32,
  },
  {
    fileName: "twitter.png",
    size: 1024,
  },
  {
    fileName: "facebook.png",
    size: 1024,
  },
];

let inputImagePath = "./public/images/base.png";
const outputDir = "./public/images";

if (process.env.IMAGE_URL) {
  const response = await fetch(process.env.IMAGE_URL);
  const buffer = await response.arrayBuffer();
  // get file extension from image_url
  const url = new URL(process.env.IMAGE_URL);
  const fileExtension = path.extname(url.pathname);
  inputImagePath = inputImagePath.replace(".png", fileExtension);
  await sharp(Buffer.from(buffer)).toFile(inputImagePath);
  console.log("Downloaded base image from URL");
} else {
  process.exit(0);
}

async function resizeImage(fileName, size) {
  // Download image from environment variable URL if provided
  const outputPath = path.join(outputDir, fileName);
  try {
    await sharp(inputImagePath)
      .png()
      .resize(size, size, {
        fit: "cover",
        position: "center",
      })
      .toFile(outputPath);

    console.log(`Image resized successfully to ${size}x${size}`);
  } catch (error) {
    console.error("Error resizing image:", error);
  }
}

// use an async IIFE to allow for-await looping
(async () => {
  for (const { fileName, size } of fileConfigs) {
    await resizeImage(fileName, size);
  }
})();
