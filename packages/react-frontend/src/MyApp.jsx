import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Complexes from "./Pages/Complexes";
import "./App.scss";

function MyApp() {
  return (
    <Router>
      <nav>
        <Link to="/complexes">Complexes</Link>
      </nav>
      <Routes>
        <Route path="/complexes" element={<Complexes />} />
      </Routes>
    </Router>
  );
}

export default MyApp;
