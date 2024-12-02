import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/WelcomePage.scss";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-buttons">
        <button className="welcome-btn" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="welcome-btn" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;