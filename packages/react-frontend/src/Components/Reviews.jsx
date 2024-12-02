import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Reviews.scss";
import ImageList from "./Restaurant/ImageList.jsx";

const Reviews = ({
  reviews,
  setReviews,
  API_PREFIX,
  editable = false, // Optional: Allow adding reviews only where necessary
  restaurantId = null, // Optional: Only needed if creating new reviews
  addAuthHeader,
  setRestaurant,
  loggedInUserId
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    item: "",
    review: "",
    rating: "",
    pictures: []
  });
  const [showImageList, setShowImageList] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  const handlePicturesChange = (e) => {
    setReviewData({ ...reviewData, pictures: Array.from(e.target.files) });
  };

  const handleImageClick = (pictures) => {
    setCurrentImages(pictures);
    setShowImageList(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("item", reviewData.item);
    formData.append("review", reviewData.review);
    formData.append("rating", reviewData.rating);
    formData.append("restaurant", restaurantId);

    // Add each picture to the FormData
    if (reviewData.pictures.length > 0) {
      reviewData.pictures.forEach((file) => formData.append("pictures", file));
    }

    try {
      const response = await fetch(`${API_PREFIX}/review`, {
        method: "POST",
        headers: addAuthHeader(),
        body: formData
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews((prevReviews) => [newReview, ...prevReviews]);
        toast.success("Review added successfully");
        setShowReviewForm(false);
        setReviewData({ item: "", review: "", rating: "", pictures: [] });

        // Refresh restaurant details to update the average rating
        const restaurantResponse = await fetch(
          `${API_PREFIX}/restaurant/${restaurantId}`,
          { headers: addAuthHeader() }
        );
        if (restaurantResponse.ok) {
          const data = await restaurantResponse.json();
          setRestaurant(data.restaurant.restaurant);
          setReviews(data.restaurant.reviews);
        }
      } else {
        const errorText = await response.text();
        console.error("Response Error:", errorText);
        toast.error("Error adding review");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Error adding review");
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`${API_PREFIX}/review/${reviewId}`, {
        method: "DELETE",
        headers: addAuthHeader()
      });

      if (response.ok) {
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review._id !== reviewId)
        );
        toast.success("Review deleted successfully");

        // Only refresh restaurant details if restaurantId is provided
        if (restaurantId) {
          const restaurantResponse = await fetch(
            `${API_PREFIX}/restaurant/${restaurantId}`,
            { headers: addAuthHeader() }
          );
          if (restaurantResponse.ok) {
            const data = await restaurantResponse.json();
            setRestaurant(data.restaurant.restaurant);
            setReviews(data.restaurant.reviews);
          }
        }
      } else {
        toast.error("Error deleting review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Error deleting review");
    }
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2>Reviews</h2>
        {editable && (
          <button
            className="add-review-button"
            onClick={() => setShowReviewForm(true)}>
            Add Review
          </button>
        )}
      </div>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review._id}
            className="review-card"
            onClick={() => navigate(`/restaurant/${review.restaurant}`)}>
            {review.author._id === loggedInUserId && (
              <button
                className="delete-review-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteReview(review._id);
                }}>
                &times;
              </button>
            )}
            <div className="header">
              <img
                src={`${review.author?.profile_pic}`}
                alt="Author"
                className="review-author-pic"
              />
              <div className="author-info">
                {review.author?.firstname} {review.author?.lastname}
              </div>
            </div>
            <div className="top-row">
              <div className="item-name">{review.item}</div>
              <div className="review-date">
                {new Date(review.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </div>
            </div>
            <div className="stars">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </div>
            <div className="review-body">{review.review}</div>
            {review.pictures && review.pictures.length > 0 && (
              <div
                className="review-pictures"
                onClick={() => handleImageClick(review.pictures)}>
                {review.pictures.map((pic, i) => (
                  <img
                    key={i}
                    src={pic}
                    alt={`Review Pic ${i + 1}`}
                    className="review-pic"
                  />
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No reviews yet</p>
      )}

      {editable && showReviewForm && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={handleSubmitReview}>
              <label>
                Item:
                <input
                  type="text"
                  name="item"
                  value={reviewData.item}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Review:
                <textarea
                  name="review"
                  value={reviewData.review}
                  onChange={handleInputChange}
                  required></textarea>
              </label>
              <label>
                Rating:
                <input
                  type="number"
                  name="rating"
                  value={reviewData.rating}
                  onChange={handleInputChange}
                  min="1"
                  max="5"
                  required
                />
              </label>
              <label>
                Pictures:
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePicturesChange}
                />
              </label>
              <button type="submit">Submit Review</button>
              <button type="button" onClick={() => setShowReviewForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showImageList && (
        <ImageList
          photos={currentImages}
          onClose={() => setShowImageList(false)}
        />
      )}
    </div>
  );
};

export default Reviews;
