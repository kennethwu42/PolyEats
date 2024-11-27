import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../Styles/RestaurantDetails.scss";
import Reviews from "../Reviews";

const RestaurantDetails = ({ API_PREFIX, addAuthHeader }) => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Fetch restaurant details
    fetch(`${API_PREFIX}/restaurant/${id}`, {
      headers: addAuthHeader()
    })
      .then((res) => res.json())
      .then((data) => {
        setRestaurant(data.restaurant.restaurant);
        setReviews(data.restaurant.reviews);
      })
      .catch((error) =>
        console.error("Error fetching restaurant details:", error)
      );

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

  return (
    <div className="restaurant-details">
      <div className="header">
        <h1>{restaurant.name}</h1>
        <button
          className={`bookmark ${isFavorite ? "favorited" : ""}`}
          onClick={toggleFavorite}>
          {isFavorite ? "★" : "☆"}
        </button>
      </div>
      <p>Cuisine: {restaurant.cuisine}</p>
      <p>Average Rating: {restaurant.avg_rating}</p>
      <p>{restaurant.description}</p>
      <p>
        Accepted Payments:{" "}
        {Object.keys(restaurant.accepted_payments).join(", ")}
      </p>
      <p>
        Nutrition Types: {Object.keys(restaurant.nutrition_types).join(", ")}
      </p>
      <p>Price: {restaurant.price}</p>
      <p>Delivery: {restaurant.delivery ? "Yes" : "No"}</p>
      <div className="hours">
        <h2>Hours</h2>
        <ul>
          {Object.entries(restaurant.hours).map(([day, hours], index) => (
            <li key={index}>
              {day}: {hours}
            </li>
          ))}
        </ul>
      </div>
      <Reviews
        reviews={reviews}
        setReviews={setReviews}
        API_PREFIX={API_PREFIX}
        editable={true} // Allow adding reviews here
        restaurantId={id} // Pass the restaurant ID
        addAuthHeader={addAuthHeader}
        setRestaurant={setRestaurant} // Pass down to update the rating
      />
    </div>
  );
};

export default RestaurantDetails;
