import reviewModel from "../models/review.js";
import restaurantModel from "../models/restaurant.js";
import { Storage } from "@google-cloud/storage";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();
const { GCLOUD_BUCKET_NAME } = process.env;

// Get the __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = new Storage({ keyFilename: path.join(__dirname, "../gcp-key.json") });
const bucket = storage.bucket(GCLOUD_BUCKET_NAME);

//post a new review
async function postReview(reviewData) {
  const review = new reviewModel(reviewData);
  const savedReview = await review.save();
  await updateRestaurantRating(review.restaurant);
  return savedReview;
}

//delete a review by its ID (only if the review is authored by the requesting user)
async function deleteReview(reviewId, accountId) {
  const review = await reviewModel.findOne({
    _id: reviewId,
    author: accountId
  });
  if (!review) {
    throw new Error("Review not found or you are not authorized to delete it.");
  }
  await reviewModel.findByIdAndDelete(reviewId);
  await updateRestaurantRating(review.restaurant);
}

//get all reviews for a specific restaurant
async function getReviewsByRestaurant(restaurantId) {
  return reviewModel
    .find({ restaurant: restaurantId })
    .populate("author", "firstname lastname profile_pic")
    .exec();
}

// Helper to calculate and update restaurant's average rating
async function updateRestaurantRating(restaurantId) {
  const reviews = await reviewModel.find({ restaurant: restaurantId });
  if (reviews.length === 0) {
    // Reset to default rating if no reviews exist
    await restaurantModel.findByIdAndUpdate(restaurantId, { avg_rating: 3 });
  } else {
    const avgRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    await restaurantModel.findByIdAndUpdate(restaurantId, {
      avg_rating: avgRating.toFixed(1) // Rounded to 1 decimal place
    });
  }
}


const uploadImageToCloud = (file) => {
  const blob = bucket.file(Date.now() + "-" + file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: { contentType: file.mimetype },
  });

  blobStream.on("error", reject);

  blobStream.on("finish", () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    resolve(publicUrl);
  });

  blobStream.end(file.buffer);
};

const saveImageToDatabase = async (imageUrl) => {
  const image = new Image({ imageUrl });
  await image.save();
  return image;
};

export default {
  postReview,
  deleteReview,
  getReviewsByRestaurant,
  uploadImageToCloud,
  saveImageToDatabase
};
