import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cards from "../Cards";
import RestaurantFilter from "./RestaurantFilter";
import "../../Styles/App.scss";
import campusMarketImage from "../../Assets/campus_market.jpg";
import logo from "../../Assets/logo.png";

const RestaurantList = ({ API_PREFIX, addAuthHeader }) => {
  const { complexId } = useParams();
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({});

  // Fetch restaurants based on filters
  const fetchRestaurants = () => {
    const filterParams = new URLSearchParams(filters).toString(); // Convert filters object to query string
    fetch(`${API_PREFIX}/complexes/${complexId}/restaurants?${filterParams}`, {
      headers: addAuthHeader()
    })
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        setRestaurants(json ? json.restaurants_list : []);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchRestaurants();
  }, [filters, complexId, API_PREFIX, addAuthHeader]); // Re-fetch when filters change

  return (
    <div>
      <div className="top-image">
        <img src={logo} alt="Top Banner" />
      </div>
      <h2>Restaurants</h2>
      <RestaurantFilter setFilters={setFilters} />
      <div className="card-container">
        {restaurants.map((restaurant, index) => (
          <Cards
            key={index}
            image={restaurant.image || campusMarketImage} // Fallback to campusMarketImage
            title={restaurant.name}
            link={`/restaurant/${restaurant._id}`} // Link to each item’s unique page
          />
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
