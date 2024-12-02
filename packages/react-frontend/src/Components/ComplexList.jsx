import React, { useEffect } from "react";
import Cards from "./Cards";
import campusMarketImage from "../Assets/campus_market.jpg";
import logo from "../Assets/logo.png";
import "../Styles/App.scss";
import { useFilters } from "./Restaurant/FiltersContext";

const ComplexList = ({ complexes }) => {
  const { setFilters } = useFilters();

  // Reset filters when ComplexList is rendered
  useEffect(() => {
    const defaultFilters = {
      name: "",
      minRating: "",
      price: "",
      cuisine: "",
      delivery: "",
      accepted_payments: {},
      nutrition_types: {},
      hours: {}
    };
    setFilters(defaultFilters); // Reset filters to default values
  }, [setFilters]);

  return (
    <div>
      <div className="top-image">
        <img src={logo} alt="Top Banner" />
      </div>
      <h2>Dining Complexes</h2>
      <div className="card-container">
        {complexes.map((complex, index) => (
          <Cards
            key={index}
            image={complex.image || campusMarketImage} // Fallback to campusMarketImage
            title={complex.name}
            link={`/complex/${complex._id}`} // Link to each item’s unique page
          />
        ))}
      </div>
    </div>
  );
};

export default ComplexList;
