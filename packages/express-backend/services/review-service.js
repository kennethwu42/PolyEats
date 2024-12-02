import reviewModel from "../models/review.js";
import restaurantModel from "../models/restaurant.js";
import { uploadFileToGCS, deleteFileFromGCS } from "../googleCloudStorage.js";

//post a new review
async function postReview(reviewData) {
  const { pictures, ...reviewDetails } = reviewData;

  // Upload pictures to Google Cloud Storage
  const pictureUrls = [];
  if (pictures && pictures.length > 0) {
    for (const file of pictures) {
      const publicUrl = await uploadFileToGCS(file, "review-pictures");
      pictureUrls.push(publicUrl);
    }
  }

  // Save the review with the picture URLs
  const review = new reviewModel({ ...reviewDetails, pictures: pictureUrls });
  const savedReview = await review.save();

  // Update the restaurant's average rating
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

  // Delete pictures associated with the review from Google Cloud Storage
  if (review.pictures && review.pictures.length > 0) {
    const deletePromises = review.pictures.map((picture) => {
      const filePath = picture.split(
        "https://storage.googleapis.com/polyeats/"
      )[1];
      return deleteFileFromGCS(filePath);
    });

    try {
      await Promise.all(deletePromises);
    } catch (error) {
      console.error(
        "Error deleting some pictures from Google Cloud:",
        error.message
      );
    }
  }

  // Delete the review from the database
  await reviewModel.findByIdAndDelete(reviewId);

  // Update the restaurant's average rating
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

export default {
  postReview,
  deleteReview,
  getReviewsByRestaurant
};
