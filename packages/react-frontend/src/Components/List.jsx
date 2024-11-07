import React from "react";
import Cards from "./Cards";
import campusMarketImage from "../assets/campus_market.jpg";
import "../App.scss";

function List({ props }) {
  return (
    <div className="card-container">
      {props.map((row, index) => (
        <Cards key={index} image={campusMarketImage} title={row.name} />
      ))}
    </div>
  );
}

export default List;