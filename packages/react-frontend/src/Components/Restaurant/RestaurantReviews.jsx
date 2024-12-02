import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../../Styles/RestaurantReviews.scss";
import Reviews from "../Reviews";
import "../../Styles/Reviews.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RestaurantReviews({ API_PREFIX, addAuthHeader }) {
  const { id } = useParams(); // Get restaurant ID from URL
  const [restaurant, setRestaurant] = useState([]); // Restaurant object
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]); // Reviews array
  const [showOverlay, setShowOverlay] = useState(false); // State to toggle overlay visibility
  const [overlayContent, setOverlayContent] = useState(null); // State to hold dynamic content for overlay
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    fetch(`${API_PREFIX}/restaurant/${id}`, {
      headers: addAuthHeader()
    })
      .then((res) => res.json())
      .then((json) => {
        setRestaurant(json.restaurant.restaurant);
        setReviews(json.restaurant.reviews);
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
          <Link
            to={`/restaurant/${id}/images`}
            className="btn btn-primary see-images-button">
            See Photos
          </Link>
        </div>
      </div>
      <div className="image-container">
        {/* Overlay that appears when button is clicked */}
        {showOverlay && (
          <div className="overlay-frame">
            <div className="overlay-content">
              <p>
                <strong>Accepted Payments: </strong>
                {Object.keys(restaurant.accepted_payments).join(", ")}
              </p>
              <p>
                <strong>Nutrition Types: </strong>
                {Object.keys(restaurant.nutrition_types).join(", ")}
              </p>
              <p>
                <strong>Delivery: </strong>
                {restaurant.delivery ? "Yes" : "No"}
              </p>
              <div className="hours">
                <h2>Hours</h2>
                <ul>
                  {Object.entries(restaurant.hours).map(
                    ([day, hours], index) => (
                      <li key={index}>
                        <strong>{day}</strong>: {hours}
                      </li>
                    )
                  )}
                </ul>
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
    </div>
  );
}

export default RestaurantReviews;
