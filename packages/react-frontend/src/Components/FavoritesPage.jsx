import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/FavoritesPage.scss";
import logo from "../Assets/logo.png";
import "../Styles/App.scss";
import Cards from "./Cards";

const FavoritesPage = ({ API_PREFIX, addAuthHeader }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_PREFIX}/account/favorites`, {
      headers: addAuthHeader()
    })
      .then((res) => res.json())
      .then((data) => {
        setFavorites(data.favorites || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching favorite restaurants:", error);
        setLoading(false);
      });
  }, [API_PREFIX, addAuthHeader]);

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
      <div className="top-image">
        <img src={logo} alt="Top Banner" />
      </div>
      <h2 className="heading">Favorites</h2>
      <div className="card-container">
        {loading ? (
          <p>Loading favorites...</p>
        ) : favorites.length > 0 ? (
          favorites.map((restaurant) => (
            <Cards
              key={restaurant._id}
              image={restaurant.image}
              title={restaurant.name}
              link={`/restaurant/${restaurant._id}`}
              removeButton={
                <button
                  className="remove-favorite"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent card link navigation
                    removeFavorite(restaurant._id);
                  }}>
                  &times;
                </button>
              }
            />
          ))
        ) : (
          <p>No favorites yet</p>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
