import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFilters } from "./FiltersContext";
import Cards from "../Cards";
import RestaurantFilter from "./RestaurantFilter";
import "../../Styles/App.scss";
import campusMarketImage from "../../Assets/campus_market.jpg";
import logo from "../../Assets/logo.png";

const RestaurantList = ({ API_PREFIX, addAuthHeader }) => {
  const { complexId } = useParams();
  const { filters, setFilters } = useFilters();
  const [restaurants, setRestaurants] = useState([]);

  // Fetch restaurants based on filters
  const fetchRestaurants = () => {
    const queryParameters = new URLSearchParams();

    // Build query parameters based on active filters
    if (filters.name) queryParameters.append("name", filters.name);
    if (filters.minRating)
      queryParameters.append("minRating", filters.minRating);
    if (filters.price) queryParameters.append("price", filters.price);
    if (filters.cuisine) queryParameters.append("cuisine", filters.cuisine);
    if (filters.delivery) queryParameters.append("delivery", filters.delivery);
    if (filters.accepted_payments)
      queryParameters.append(
        "accepted_payments",
        JSON.stringify(filters.accepted_payments)
      );
    if (filters.nutrition_types)
      queryParameters.append(
        "nutrition_types",
        JSON.stringify(filters.nutrition_types)
      );
    if (filters.hours)
      queryParameters.append("hours", JSON.stringify(filters.hours));

    // Add sorting parameters
    if (filters.sortField)
      queryParameters.append("sortField", filters.sortField);
    if (filters.sortOrder)
      queryParameters.append("sortOrder", filters.sortOrder);

    // Fetch restaurants with new query parameters
    fetch(
      `${API_PREFIX}/complexes/${complexId}/restaurants?${queryParameters.toString()}`,
      {
        headers: addAuthHeader()
      }
    )
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to fetch restaurants")
      )
      .then((data) => setRestaurants(data.restaurants_list))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchRestaurants();
  }, [filters, complexId, API_PREFIX, addAuthHeader]); // Re-fetch when filters change

  return (
    <div>
      <div className="top-image">
        <img src={logo} alt="Top Banner" />
      </div>
      <div className="card-container">
        <h2 className="heading">Restaurants</h2>
        <RestaurantFilter setFilters={setFilters} />
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
