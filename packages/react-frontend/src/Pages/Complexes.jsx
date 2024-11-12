import React, { useState, useEffect } from "react";
import ComplexList from "../Components/ComplexList";
import campusMarketImage from "../assets/campus_market.jpg";
import "../App.scss";

function Complexes() {
  const [complexes, setComplexes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/complexes")
      .then((res) => res.json())
      .then((json) => setComplexes(json.complexes_list))
      .catch((error) => console.error("Error fetching complexes:", error));
  }, []);

  return (
    <div>
      <div className="top-image">
        <img src={campusMarketImage} alt="Top Banner" />
      </div>
      <h1>Complexes</h1>
      <ComplexList props={complexes} />
    </div>
  );
}

export default Complexes;