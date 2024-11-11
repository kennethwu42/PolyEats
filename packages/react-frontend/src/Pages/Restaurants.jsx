import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import campusMarketImage from "../assets/campus_market.jpg";
import CardList from "../Components/CardList";
import "../App.scss";

function Restaurants() {
  const { complexId } = useParams();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/complexes/${complexId}/restaurants`)
      .then((res) => res.json())
      .then((json) => setRestaurants(json.restaurants_list))
      .catch((error) => console.error("Error fetching restaurants:", error));
  }, []);

  return (
    <div>
      <div className="top-image">
        <img src={campusMarketImage} alt="Top Banner" />
      </div>
      <h1>Restaurants</h1>
      <CardList props={restaurants} />
    </div>
  );
}

export default Restaurants;