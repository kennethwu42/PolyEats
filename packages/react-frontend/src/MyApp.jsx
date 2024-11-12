import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Complexes from "./Pages/Complexes";
import Restaurants from "./Pages/Restaurants";
import RestaurantReviews from "./Pages/RestaurantReviews";
import "./App.scss";

function MyApp() {
  return (
    <Router>
      <nav>
        <Link to="/complexes">Complexes</Link>
      </nav>
      <Routes>
        <Route path="/complexes" element={<Complexes />} />
        <Route path="/complexes/:complexId/restaurants" element={<Restaurants />} />
        <Route path="/restaurant/:id" element={<RestaurantReviews />} />
      </Routes>
    </Router>
  );
}

export default MyApp;
