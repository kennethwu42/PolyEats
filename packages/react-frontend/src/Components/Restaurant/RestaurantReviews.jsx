import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../Styles/RestaurantReviews.scss";
import Reviews from "../Reviews";
import "../../Styles/Reviews.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageList from "./ImageList";

const LABEL_MAP = {
  CreditDebit: "Credit/Debit",
  GlutenFree: "Gluten-Free",
  M: "Monday",
  T: "Tuesday",
  W: "Wednesday",
  TH: "Thursday",
  F: "Friday",
  SAT: "Saturday",
  SUN: "Sunday"
};

function RestaurantReviews({ API_PREFIX, addAuthHeader }) {
  const { id } = useParams(); // Get restaurant ID from URL
  const [restaurant, setRestaurant] = useState(null); // Restaurant object
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]); // Reviews array
  const [showOverlay, setShowOverlay] = useState(false); // State to toggle overlay visibility
  const [overlayContent, setOverlayContent] = useState(null); // State to hold dynamic content for overlay
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [showImageList, setShowImageList] = useState(false);
  const [reviewImages, setReviewImages] = useState([]);

  useEffect(() => {
    fetch(`${API_PREFIX}/restaurant/${id}`, {
      headers: addAuthHeader()
    })
      .then((res) => res.json())
      .then((json) => {
        setRestaurant(json.restaurant.restaurant);
        setReviews(json.restaurant.reviews);

        // Extract all images from reviews
        const allImages = json.restaurant.reviews.flatMap(
          (review) => review.pictures || []
        );
        setReviewImages(allImages); // Set pooled images
      })
      .catch((error) => console.error("Error fetching restaurant:", error));

    // Fetch logged-in user ID
    fetch(`${API_PREFIX}/account/details`, {
      headers: addAuthHeader()
    })
      .then((res) => res.json())
      .then((data) => {
        setLoggedInUserId(data.account._id);
      })
      .catch((error) => console.error("Error fetching user details:", error));

    // Check if restaurant is in favorites
    fetch(`${API_PREFIX}/account/favorites`, {
      headers: addAuthHeader()
    })
      .then((res) => res.json())
      .then((data) => {
        const favorites = data.favorites || [];
        setIsFavorite(favorites.some((fav) => fav._id === id));
      })
      .catch((error) =>
        console.error("Error fetching favorite restaurants:", error)
      );
  }, [API_PREFIX, addAuthHeader, id]);

  // Synchronize reviewImages with updated reviews
  useEffect(() => {
    const updatedImages = reviews.flatMap((review) => review.pictures || []);
    setReviewImages(updatedImages);
  }, [reviews]);

  // Add or remove restaurant from favorites
  const toggleFavorite = async () => {
    const url = `${API_PREFIX}/account/favorites/${id}`;
    const method = isFavorite ? "DELETE" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: addAuthHeader()
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        toast.success(
          isFavorite
            ? "Restaurant removed from favorites"
            : "Restaurant added to favorites"
        );
      } else {
        toast.error("Error updating favorites");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Something went wrong!");
    }
  };

  if (!restaurant) {
    return <p>Loading restaurant details...</p>;
  }

  const handleOverlayToggle = (content) => {
    setOverlayContent(content); // Set content dynamically
    setShowOverlay(!showOverlay); // Toggle overlay visibility
  };

  const mapLabel = (key) => LABEL_MAP[key] || key;

  return (
    <div>
      <div className="restaurant-top-banner">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="restaurant-image"
        />
        <div className="restaurant-overlay">
          <h1 className="restaurant-name">{restaurant.name}</h1>
          <div className="details">
            {restaurant.cuisine} - {restaurant.price}
            <div className="stars">
              {"★".repeat(restaurant.avg_rating)}
              {"☆".repeat(5 - Math.floor(restaurant.avg_rating))}
            </div>
          </div>
          <button
            className="btn btn-primary see-images-button"
            onClick={() => setShowImageList(true)} // Show ImageList when clicked
          >
            See Photos
          </button>
        </div>
      </div>
      <div className="image-container">
        {/* Overlay that appears when button is clicked */}
        {showOverlay && (
          <div className="overlay-frame">
            <div className="overlay-content">
              <p>
                <strong>Accepted Payments: </strong>
                {Object.keys(restaurant.accepted_payments)
                  .map(mapLabel)
                  .join(", ")}
              </p>
              <p>
                <strong>Nutrition Types: </strong>
                {Object.keys(restaurant.nutrition_types)
                  .map(mapLabel)
                  .join(", ")}
              </p>
              <p>
                <strong>Delivery: </strong>
                {restaurant.delivery ? "Yes" : "No"}
              </p>
              <div className="hours">
                <h2>Hours</h2>
                <div>
                  {Object.entries(restaurant.hours).map(
                    ([day, hours], index) => (
                      <div key={index}>
                        <strong>{mapLabel(day)}:</strong> {hours}
                      </div>
                    )
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowOverlay(false)}
                className="close-overlay-button">
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="details">
        <button
          onClick={() =>
            handleOverlayToggle(
              <div>
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description}</p>
              </div>
            )
          }
          className="toggle-overlay-button">
          See Details
        </button>
        <button
          className={`bookmark ${isFavorite ? "favorited" : ""}`}
          onClick={toggleFavorite}>
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      <Reviews
        reviews={reviews}
        setReviews={setReviews}
        API_PREFIX={API_PREFIX}
        editable={true} // Allow adding reviews here
        restaurantId={id} // Pass the restaurant ID
        addAuthHeader={addAuthHeader}
        setRestaurant={setRestaurant} // Pass down to update the rating
        loggedInUserId={loggedInUserId}
      />

      {showImageList && (
        <ImageList
          photos={reviewImages}
          onClose={() => setShowImageList(false)} // Close ImageList
        />
      )}
    </div>
  );
}

export default RestaurantReviews;
