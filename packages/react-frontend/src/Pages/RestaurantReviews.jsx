import React, { useState, useEffect } from "react";
import campusMarketImage from "../assets/campus_market.jpg";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import "../App.scss";

function RestaurantReviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/restaurant/${id}`)
      .then((res) => res.json())
      .then((json) => setReviews(json.reviews))
      .catch((error) => console.error("Error fetching complexes:", error));
  }, []);


  return (
    <div>
      <div className="top-image">
        <img src={campusMarketImage} alt="Top Banner" />
      </div>
      <h1>Reviews</h1>
      <div className="top-image">
        <Card style={{ width: "20rem" }}>
            <Card.Img variant="top" src={campusMarketImage} />
            <Card.Body>
            <Card.Title>Write Review</Card.Title>
            </Card.Body>
        </Card>
      </div>
      {/* <List props={reviews} /> */}
    </div>
  );
}

export default RestaurantReviews;