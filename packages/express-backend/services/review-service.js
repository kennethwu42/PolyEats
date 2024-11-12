import reviewModel from "../models/review.js";

//post a new review
async function postReview(reviewData) {
  const review = new reviewModel(reviewData);
  return review.save();
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
  return reviewModel.findByIdAndDelete(reviewId);
}

//get all reviews for a specific restaurant
async function getReviewsByRestaurant(restaurantId) {
  return reviewModel
    .find({ restaurant: restaurantId })
    .populate("author", "firstname lastname")
    .exec();
}

export default {
  postReview,
  deleteReview,
  getReviewsByRestaurant
};
