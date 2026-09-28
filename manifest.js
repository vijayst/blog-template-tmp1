import fs from "fs";

const manifestPath = "./public/site.webmanifest";
const siteName = process.env.SITE_NAME
const shortName = process.env.SHORT_NAME ?? siteName;

async function updateManifest() {
  try {
    // Read the manifest file
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(manifestContent);

    // Update name and short_name
    manifest.name = siteName;
    manifest.short_name = shortName;

    // Write back to the same file
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`✓ Manifest updated: ${siteName}`);
  } catch (error) {
    console.error("Error updating manifest:", error);
  }
}

updateManifest();