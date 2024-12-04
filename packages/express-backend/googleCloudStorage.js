import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";

//load environment variables
dotenv.config();

const fs = require("fs");
const path = require("path");

if (process.env.GOOGLE_CLOUD_KEY_BASE64) {
  const decodedKey = Buffer.from(
    process.env.GOOGLE_CLOUD_KEY_BASE64,
    "base64"
  ).toString("utf-8");
  const tempKeyPath = path.join(__dirname, "google-cloud-key.json");

  // Write the decoded key to a temporary file
  fs.writeFileSync(tempKeyPath, decodedKey);

  // Set GOOGLE_APPLICATION_CREDENTIALS to the temp key path
  process.env.GOOGLE_APPLICATION_CREDENTIALS = tempKeyPath;
} else {
  console.error(
    "GOOGLE_CLOUD_KEY_BASE64 is not set in the environment variables."
  );
  process.exit(1); // Exit the process if the key is missing
}


// Initialize Google Cloud Storage
const storage = new Storage();
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);

// Upload file to Google Cloud Storage
export const uploadFileToGCS = async (file, destinationFolder) => {
  const fileName = `${destinationFolder}/${Date.now()}-${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  try {
    await fileUpload.save(file.buffer, {
      resumable: false,
      metadata: {
        contentType: file.mimetype
      }
    });

    // Make the file public (optional)
    await fileUpload.makePublic();

    // Return the public URL
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  } catch (err) {
    throw new Error(`Failed to upload file to GCS: ${err.message}`);
  }
};

// Delete file from Google Cloud Storage
export const deleteFileFromGCS = async (filePath) => {
  try {
    console.log(filePath);
    await bucket.file(filePath).delete();
  } catch (err) {
    console.error(`Failed to delete file from GCS: ${err.message}`);
  }
};
