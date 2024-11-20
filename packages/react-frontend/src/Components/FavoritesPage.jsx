import { useEffect, useState } from "react";
import "../Styles/FavoritesPage.scss";
import campusMarketImage from "../assets/campus_market.jpg";

const FavoritesPage = ({ API_PREFIX, addAuthHeader }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    //fetch favorite restaurants
    fetch(`${API_PREFIX}/account/favorites`, {
      headers: addAuthHeader()
    })
      .then((res) => res.json())
      .then((data) => {
        setFavorites(data.favorites || []);
      })
      .catch((error) =>
        console.error("Error fetching favorite restaurants:", error)
      );
  }, [API_PREFIX, addAuthHeader]);

  //remove a restaurant from favorites
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
        alert("Restaurant removed from favorites.");
      } else {
        alert("Error removing restaurant from favorites.");
      }
    } catch (error) {
      console.error("Error removing favorite restaurant:", error);
    }
  };

  return (
    <div className="favorites-page">
      <h2>Favorites</h2>
      <div className="favorites-list">
        {favorites.length > 0 ? (
          favorites.map((restaurant) => (
            <div key={restaurant._id} className="favorite-card">
              <img
                src={campusMarketImage} //`${API_PREFIX}/${restaurant.image}
                alt={restaurant.name}
                className="favorite-image"
              />
              <div className="favorite-info">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.cuisine}</p>
                <button
                  className="remove-button"
                  onClick={() => removeFavorite(restaurant._id)}>
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No favorites yet</p>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
