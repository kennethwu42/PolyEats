import React from "react";
import Cards from "./Cards";
import campusMarketImage from "../assets/campus_market.jpg";
import "../App.scss";

const colors = ["#2b46b7", "#86d561", "#47bff9", "#ffe05d", "#fe933b", "#f74943", "#ee75de", "#7356d3", "#1a602a"];

function RestaurantList({ props }) {
  return (
    <div className="card-container">
      {props.map((row, index) => (
        <Cards
          key={index} 
          color={colors[index % colors.length] || campusMarketImage}  // Fallback to campusMarketImage
          title={row.name}
          link={`/restaurant/${row._id}`}          // Link to each item’s unique page
        />
      ))}
    </div>
  );
}

export default RestaurantList;