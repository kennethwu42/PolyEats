import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../Styles/BottomNavBar.scss";

const BottomNavBar = () => {
  const location = useLocation();

  return (
    <div className="bottom-nav">
      <Link to="/complexes" className={location.pathname === "/complexes" ? "active" : ""}>
        Home
      </Link>
      <Link
        to="/favorites"
        className={location.pathname === "/favorites" ? "active" : ""}>
        Favorites
      </Link>
      <Link
        to="/account"
        className={location.pathname === "/account" ? "active" : ""}>
        Account
      </Link>
    </div>
  );
};

export default BottomNavBar;
