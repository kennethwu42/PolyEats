import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Cards from "../Components/Cards";
import ImageList from "../Components/ImageList";
import "../App.scss";

function RestaurantReviews() {
  const { id } = useParams(); // Get restaurant ID from URL
  const [restaurant, setRestaurant] = useState([]); // Restaurant object
  const [reviews, setReviews] = useState([]); // Reviews array

  useEffect(() => {
    fetch(`http://localhost:8000/restaurant/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setRestaurant(json.restaurant);
        setReviews(json.restaurant.reviews); // Assuming `reviews` is a field in `json.restaurant`
      })
      .catch((error) => console.error("Error fetching restaurant:", error));
  }, [id]);

  if (!restaurant) {
    return <p>Loading restaurant details...</p>; // Display a loading message while fetching
  }

  return (
    <div>
      <div className="top-image">
        <img src={logo} alt="Top Banner" />
      </div>
      <h1>Reviews</h1>
      <div className="top-image">
        <Card style={{ width: "20rem" }}>
          <div style={{ height: "200px", backgroundColor: "#86d561" }}></div>
            <Card.Body>
            <Card.Title>Write Review</Card.Title>
            </Card.Body>
        </Card>
      </div>
      <div className="top-image">
        <Cards 
            color={"#1a602a" || campusMarketImage}  // Fallback to campusMarketImage
            title={"Images"}
            link={`/restaurant/${id}/images`}          // Link to each item’s unique page
          />
      </div>
      <div className="review-list">
        {reviews.map((review, index) => (
          <Card key={index} style={{ margin: "1rem", width: "25rem" }}>
            <Card.Body>
              <Card.Title>{review.author}</Card.Title>
              <Card.Text>{review.text}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default RestaurantReviews;