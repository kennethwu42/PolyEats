import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";

//load environment variables
dotenv.config();

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
