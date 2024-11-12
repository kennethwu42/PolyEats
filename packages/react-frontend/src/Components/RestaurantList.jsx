import React from "react";
import Cards from "./Cards";
import campusMarketImage from "../assets/campus_market.jpg";
import "../App.scss";

function RestaurantList({ props }) {
  return (
    <div className="card-container">
      {props.map((row, index) => (
        <Cards
          key={index} 
          image={row.image || campusMarketImage}  // Fallback to campusMarketImage
          title={row.name}
          link={`/restaurant/${row._id}`}          // Link to each item’s unique page
        />
      ))}
    </div>
  );
}

export default RestaurantList;