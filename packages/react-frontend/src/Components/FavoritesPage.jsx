import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/FavoritesPage.scss";

const FavoritesPage = ({ API_PREFIX, addAuthHeader }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    // Fetch favorite restaurants
    fetch(`${API_PREFIX}/account/favorites`, {
      headers: addAuthHeader()
    })
      .then((res) => res.json())
      .then((data) => {
        setFavorites(data.favorites || []);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching favorite restaurants:", error);
        setLoading(false); // Ensure loading is false even if an error occurs
      });
  }, [API_PREFIX, addAuthHeader]);

  // Remove a restaurant from favorites
  const removeFavorite = async (restaurantId) => {
    try {
      const response = await fetch(
        `${API_PREFIX}/account/favorites/${restaurantId}`,
        {
          method: "DELETE",
          headers: addAuthHeader()
        }
      );

      if (response.ok) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((restaurant) => restaurant._id !== restaurantId)
        );
        toast.success("Restaurant removed from favorites");
      } else {
        toast.error("Error removing restaurant from favorites");
      }
    } catch (error) {
      console.error("Error removing favorite restaurant:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="favorites-page">
      <h2>Favorites</h2>
      <div className="favorites-list">
        {loading ? (
          <p>Loading favorites...</p> // Display this while loading
        ) : favorites.length > 0 ? (
          favorites.map((restaurant) => (
            <Card
              key={restaurant._id}
              style={{
                width: "18rem",
                margin: "10px",
                display: "inline-block",
                verticalAlign: "top"
              }}>
              <Link
                to={`/restaurant/${restaurant._id}`}
                style={{ textDecoration: "none", color: "inherit" }}>
                <Card.Img
                  variant="top"
                  src={restaurant.image}
                  alt={restaurant.name}
                />
                <Card.Body>
                  <Card.Title>{restaurant.name}</Card.Title>
                  <Card.Text>{restaurant.cuisine}</Card.Text>
                </Card.Body>
              </Link>
              <Card.Footer>
                <Button
                  variant="danger"
                  onClick={() => removeFavorite(restaurant._id)}>
                  Remove from Favorites
                </Button>
              </Card.Footer>
            </Card>
          ))
        ) : (
          <p>No favorites yet</p>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
